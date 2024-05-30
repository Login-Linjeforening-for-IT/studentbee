import Image from 'next/image'
import Link from 'next/link'
import { RightIcon, MiddleIcon, LeftIcon } from './clientNav'
import UserInfo from './userInfo'
import ToolTips from './root/toolTips'

// Displays the header
export default function Navbar() {
    const size = 38

    return (
        <div className='grid grid-cols-8 h-full w-full gap-4'>
            <ToolTips />
            {/* logo */}
            <Link href='/' className='grid place-items-center'>
                <Image src={"/images/logo/logo.svg"} alt="logo" height={size} width={size} />
            </Link>
            {/* Info for the user */}
            <UserInfo />
            {/* account, login */}
            <div className='grid grid-cols-3 justify-between w-full rounded-xl'>
                {/* Scoreboard */}
                <LeftIcon />
                {/* create account */}
                <MiddleIcon />
                {/* login */}
                <RightIcon />
            </div>
        </div>
    )
}