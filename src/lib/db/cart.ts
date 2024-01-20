import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";

export async function getCart() {
    const localCartId = cookies().get('localCartId')?.value;
    const cart = localCartId ?
    await prisma.cart.findUnique({
        where: {id: localCartId},
        include: { CartItem: true }
    })
}


export async function createCart() {
    const newCart = await prisma.cart.create({
        data: {}
    })
    cookies().set('localCartId', newCart.id);
}