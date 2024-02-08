import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Cart, Prisma } from "@prisma/client"
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

    }else {
        const localCartId = cookies().get('localCartId')?.value;
        cart = localCartId ?
        await prisma.cart.findUnique({
            where: { id: localCartId },
            include: { cartItem: {include: {product: true} } },
        }) : null
    }

    const localCartId = cookies().get('localCartId')?.value
    
    await prisma.cart.findUnique({
        where: {id: localCartId},
        include: { cartItem: {include: {product: true} } }
    })
    : null;

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