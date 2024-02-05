import { getCart } from "@/lib/db/cart";
import CartEntry from "./CartEntry";
import { setProductQuantity } from "./actions";

export const metadata = {
    title: "Your Cart - WhereYes"
}



export default async function CartPage() {
    const cart = await getCart();

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
            {cart?.cartItem.map(cartItem => (
                <CartEntry key={cartItem.id} cartItem={cartItem} setProductQuantity={setProductQuantity} />
            ))}
        </div>
    )
}