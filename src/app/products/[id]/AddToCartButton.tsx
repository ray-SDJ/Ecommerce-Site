"use client";

interface AddtoCartButtonProps {
    productId: string,
}

export default function AddToCartButton({productId}: AddtoCartButtonProps) {
    return (
        <div className="flex items-center gap-2">
            <button
            className="btn btn-primary"
            onClick={() => {}}>
                Add to Cart
                <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="256" width="256"/><path d="M184,184H69.8L41.9,30.6A8,8,0,0,0,34.1,24H16" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><circle cx="80" cy="204" fill="none" r="20" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><circle cx="184" cy="204" fill="none" r="20" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M62.5,144H188.1a15.9,15.9,0,0,0,15.7-13.1L216,64H48" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
            </button>

        </div>
    )

}