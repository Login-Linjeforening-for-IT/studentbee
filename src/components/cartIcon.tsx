'use client'

import { useEffect, useState } from "react"

// Displays the cart icon and the item count
export default function CartIcon() {
    const [cart, setCart] = useState<number>(0)
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            const cartLength = JSON.parse(localStorage.getItem('cart') || '[]').length

            if (cartLength != cart) {
                setCart(cartLength)
            }
        }, 100)

        return () => {
            clearInterval(intervalId)
        }
    }, [cart])

    if (cart == 0) {
        return null
    }

    return (
        <div className='bg-orange-500 w-[25px] h-[25px] absolute ml-[50px] rounded-2xl'>
            <h1 className='grid place-items-center'>{cart}</h1>
        </div>
    )
}
