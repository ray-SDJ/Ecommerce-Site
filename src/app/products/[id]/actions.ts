"use server";
import { prisma } from "@/lib/db/prisma";
import { CartItem }from "@prisma/client"
import { getCart, createCart } from "@/lib/db/cart";
import { revalidatePath } from "next/cache";


export async function incrementProductQuantity(params: string) {
    const cart = (await getCart() ?? await  createCart());

    const articleInCart = cart.cartItem.find(item => item.productId === productId)

    if (articleInCart) {
        await prisma.cartItem.update({
             where: { id: articleInCart.id},
             data: { quantity: {increment: 1 }}
        })
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity: 1,
            },
        });
    }

    revalidatePath("/products/[id")
}