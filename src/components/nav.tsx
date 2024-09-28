import Image from 'next/image'
import Link from 'next/link'
import UserInfo from './userInfo'
import ToolTips from './root/toolTips'
import Sidebar, { SidebarButton } from './sidebar'
import { RightSide } from './clientNav'

// Displays the header
export default function Navbar() {
    return (
        <div className='flex w-full gap-4 overflow-hidden'>
            <Sidebar />
            <ToolTips />
            {/* logo */}
            <div className='pl-2 flex gap-2 mx-auto'>
                <Link href='/' className='grid w-[4vh] h-[4vh] relative self-center'>
                    <Image src={"/images/logo/logo.svg"} alt="logo" fill={true} />
                </Link>
                <SidebarButton />
            </div>
            {/* Info for the user */}
            <UserInfo />
            {/* account, login */}
            <RightSide />
        </div>
    )
}
