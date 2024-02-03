export const metadata = {
    title: "Your Cart - WhereYes"
}



export default async function CartPage() {
    const cart = await getCart();

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
            {cart?.items.map(cartItem => (
                
            ))}
        </div>
    )
}