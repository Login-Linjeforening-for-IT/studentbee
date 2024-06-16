import Image from 'next/image'
import Link from 'next/link'
import { RightIcon, MiddleIcon, LeftIcon } from './clientNav'
import UserInfo from './userInfo'
import ToolTips from './root/toolTips'
import Sidebar, { SidebarButton } from './sidebar'

// Displays the header
export default function Navbar() {

    return (
        <div className='grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 h-full w-full gap-4 overflow-hidden'>
            <Sidebar />
            <ToolTips />
            {/* logo */}
            <div className='pl-2 flex gap-2 mx-auto lg:pl-0'>
                <Link href='/' className='grid w-[4vh] h-[4vh] relative self-center'>
                    <Image src={"/images/logo/logo.svg"} alt="logo" fill={true} />
                </Link>
                <SidebarButton />
            </div>
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
