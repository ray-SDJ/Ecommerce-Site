"use client";

import { CartItemWithProducts } from "@/lib/db/cart";
import Image from "next/image";

interface CartEntryProps {
    cartItem: CartItemWithProducts,
}



export default function CartEntry({cartItem : {product, quantity}}: CartEntryProps) {
    return (
        <div>
            <div className="flex flex-wrap items-center gap-3">
                <Image src={product.imageUrl} alt={product.name} width={200} height={200} className="rounded-lg"/>
            </div>
            <div className="divider"/>
        </div>
    )
}