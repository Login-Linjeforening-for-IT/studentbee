import Image from 'next/image'
import Link from 'next/link'
import { RightIcon, MiddleIcon, LeftIcon } from './clientNav'
import UserInfo from './userInfo'
import ToolTips from './root/toolTips'

// Displays the header
export default function Navbar() {

    return (
        <div className='grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 h-full w-full gap-4'>
            <ToolTips />
            {/* logo */}
            <Link href='/' className='grid w-[40px] h-[40px] relative xs:justify-self-center self-center'>
                <Image src={"/images/logo/logo.svg"} alt="logo" fill={true} />
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
