import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Cart, CartItem, Prisma, } from "@prisma/client"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";



export type CartWithProducts = Prisma.CartGetPayload<{
    include: {
        cartItem: {
            include: {
                product: true
            }
        }
    }
}>
export type CartItemWithProducts = Prisma.CartItemGetPayload<{
    include: {
        product: true
    }
}>





export type ShoppingCart = CartWithProducts & {
    size: number
    subtotal: number,
}

export async function getCart(): Promise<ShoppingCart| null> {
    const session = await getServerSession(authOptions)
    let cart: CartWithProducts | null = null;
    if (session) {
        cart = await prisma.cart.findFirst({
            where: {userId : session.user.id },
            include: { cartItem: {include: {product: true} } },
        })
    }else {
        const localCartId = cookies().get('localCartId')?.value;
        cart = localCartId ?
        await prisma.cart.findUnique({
            where: { id: localCartId },
            include: { cartItem: {include: {product: true} } },
        }) : null
    }

    const localCartId = cookies().get('localCartId')?.value;
    cart = localCartId ?
    await prisma.cart.findUnique({
        where: {id: localCartId},
        include: { cartItem: {include: {product: true} } },
    }) : null;

    if (!cart) {
        return null
    }
    return {
        ...cart,
        size: cart.cartItem.reduce((acc, item) => acc + item.quantity, 0),
        subtotal: cart.cartItem.reduce((acc, item) => acc + item.quantity * item.product.price, 0)
    }
}


export async function createCart(): Promise<ShoppingCart > {
    const session = await getServerSession(authOptions);

    let newCart: Cart;

    if (session) {
        newCart = await prisma.cart.create({
            data: { userId: session.user.id },
        });
        
    } else {
        newCart = await prisma.cart.create({
        data: {}
    });
    cookies().set('localCartId', newCart.id);
    }


    

    return {
        ...newCart,
        cartItem: [],
        size: 0,
        subtotal: 0
    }
}



export async function mergeAnonymousCartIntoUserCart(userId: string) {
    const localCartId = cookies().get('localCartId')?.value;

    const localCart = localCartId ?
        await prisma.cart.findUnique({
            where: { id: localCartId },
            include: { cartItem: true },
        }) : null;

    if (!localCart) return;
    const userCart = await prisma.cart.findFirst({
        where: { userId },
        include: { cartItem: true },
    });
    await prisma.$transaction(async tx => {
        if (userCart) {
            const mergedCartItems = mergeCartItems(localCart.cartItem, userCart.cartItem);
            await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
            
            await tx.cart.update({
                where: { id: userCart.id },
                data: {
                    cartItem: {
                        createMany: {
                            data: mergedCartItems.map(items => ({
                                productId: items.productId,
                                quantity: items.quantity
                            })),
                        }
                    }
                }
            })


        } else {
            await tx.cart.create({
                data: {
                    userId,
                    cartItem: {
                        createMany: {
                            data: localCart.cartItem.map(item => ({
                                productId: item.productId,
                                quantity: item.quantity
                            })),
                        }
                    }
                }
            })
        }
        await tx.cart.delete({
            where: { id: localCart.id }
        });
        cookies().set("localCartId", "")
    })
    }



function mergeCartItems(...cartProducts: CartItem[][]) {
    return cartProducts.reduce((acc, items) => {
        items.forEach((item) => {
            const existingItem = acc.find((i) => i.productId === item.productId);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                acc.push(item);
            }
        });
        return acc;
    }, [] as CartItem[])
}