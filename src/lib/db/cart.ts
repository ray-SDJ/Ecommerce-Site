import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Cart, Prisma } from "@prisma/client"

export type CartWithProducts = Prisma.CartGetPayload<{
    include: {
        cartItem: {
            include: {
                product: true
            }
        }
    }
}>

export type ShoppingCart = CartWithProducts & {
    size: number
    subtotal: number,
}

export async function getCart(): Promise<ShoppingCart| null> {
    const localCartId = cookies().get('localCartId')?.value
    const cart = localCartId ?
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
    const newCart = await prisma.cart.create({
        data: {}
    })
    cookies().set('localCartId', newCart.id);

    return {
        ...newCart,
        cartItem: [],
        size: 0,
        subtotal: 0
    }
}