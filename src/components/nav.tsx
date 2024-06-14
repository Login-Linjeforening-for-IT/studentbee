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
            <div className='pl-2 flex gap-2 lg:grid place-items-center lg:pl-0'>
                <Link href='/' className='grid w-[40px] h-[40px] relative xs:justify-self-center self-center'>
                    <Image src={"/images/logo/logo.svg"} alt="logo" fill={true} />
                </Link>
                <Burger />
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

function Burger() {
    return (
        <div className='lg:hidden w-[50px] h-[45px] grid grid-rows-3 gap-2 p-2 self-center'>
            <div className='bg-white rounded-xl h-[3px] self-center' />
            <div className='bg-white rounded-xl h-[3px] self-center' />
            <div className='bg-white rounded-xl h-[3px] self-center' />
        </div>
    )
}
