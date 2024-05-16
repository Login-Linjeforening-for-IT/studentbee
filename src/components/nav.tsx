import Image from 'next/image'
import Link from 'next/link'
import ProfileIcon, { RegisterIcon } from './clientNav'
import getCookie from '@/utils/cookies'
import UserInfo from './userInfo'
// import logo from "/images/logo/logo.svg"

// Displays the header
export default function Navbar() {
    return (
        <div className='grid grid-cols-10 h-full w-full gap-4'>
            {/* logo */}
            {/* {logo} */}
            <Link href='/' className='grid place-items-center'>
                <Image src={"/images/logo/logo.svg"} alt="logo" height={50} width={50} />
            </Link>
            {/* Info for the user */}
            <UserInfo />
            {/* account, login */}
            <div className='grid grid-cols-2 justify-between w-full rounded-xl'>
                {/* create account */}
                <RegisterIcon />
                {/* login */}
                <ProfileIcon />
            </div>
        </div>
    )
}