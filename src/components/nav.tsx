import Image from 'next/image'
import Link from 'next/link'
import ToolTips from './root/toolTips'
import Sidebar from './sidebar'
import { RightSide } from './clientNav'
import { ArrowUpRight } from 'lucide-react'

// Displays the header
export default function Navbar() {
    return (
        <div className='flex justify-between bg-black h-full w-full md:px-[1rem] gap-2 overflow-hidden px-4'>
            <Sidebar />
            <ToolTips />
            {/* logo */}
            <div className='flex items-center h-[3rem] md:w-[10rem]'>
                <Link href='/' className='relative block h-8 w-8'>
                    <Image
                        src={'/images/logo/logo.svg'}
                        className='object-cover'
                        alt='logo'
                        fill={true}
                    />
                </Link>
            </div>
            {/* Info for the user */}
            {/* <UserInfo /> */}
            {/* Links */}
            <nav className='hidden md:flex justify-between items-center w-fill max-w-[40rem]'>
                <Link href={'/scoreboard'}>
                    <li className='text-white flex flex-row items-center list-none no-underline leading-[1rem] p-3 font-medium cursor-pointer link--corner-hover'>
                        Scoreboard
                    </li>
                </Link>
                <Link href='/grades'>
                    <li className='text-white flex flex-row items-center list-none no-underline leading-[1rem] p-3 font-medium cursor-pointer link--corner-hover'>
                        Exam statistics
                    </li>
                </Link>
                <Link href='https://login.no'>
                    <li className='text-white flex flex-row items-center list-none no-underline leading-[1rem] p-3 pr-[1.5rem] font-medium cursor-pointer link--corner-hover'>
                        Login
                        <ArrowUpRight className='absolute right-1 w-[1.25rem] h-[1.25rem] text-login'/>
                    </li>
                </Link>
            </nav>
            {/* account, login */}
            <RightSide />
        </div>
    )
}
