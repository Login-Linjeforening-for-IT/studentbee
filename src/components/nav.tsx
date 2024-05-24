import Image from 'next/image'
import Link from 'next/link'
import RightIcon, { LeftIcon } from './clientNav'
import UserInfo from './userInfo'

// Displays the header
export default function Navbar() {
    return (
        <div className='grid grid-cols-10 h-full w-full gap-4'>
            {/* logo */}
            {/* {logo} */}
            <Link href='/' className='grid place-items-center'>
                <Image src={"/images/logo/logo.svg"} alt="logo" height={40} width={40} />
            </Link>
            {/* Info for the user */}
            <UserInfo />
            {/* account, login */}
            <div className='grid grid-cols-2 justify-between w-full rounded-xl'>
                {/* create account */}
                <LeftIcon />
                {/* login */}
                <RightIcon />
            </div>
        </div>
    )
}