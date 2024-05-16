import Image from 'next/image'
import Link from 'next/link'
import CartIcon from './cartIcon'
import ProfileIcon, { RegisterIcon } from './clientNav'

// Displays the header
export default function Navbar() {
    return (
        <div className='grid grid-cols-3 h-full w-full gap-4 bg-red-200'>
            {/* logo */}
            <Link href='/' className='grid place-items-center'>
                <Image src="/images/logo/logo.png" alt="logo" height={70} width={70} />
            </Link>
            {/* search bar to be removed */}
            <h1>
                {/* username */}
                {/* questions answered this session */}
                {/* time spent on this session */}
                {/* some exam related motivational quote? */}
            </h1>
            {/* account, login, cart */}
            <div className='grid grid-cols-3 justify-between w-full rounded-xl'>
                {/* create account */}
                <RegisterIcon />
                {/* login */}
                <ProfileIcon />
                {/* cart */}
                <Link href='/cart' className='grid place-items-center'>
                    <CartIcon />
                    <Image src="/images/cart.svg" alt="logo" height={50} width={50} />
                </Link>
            </div>
        </div>
    )
}