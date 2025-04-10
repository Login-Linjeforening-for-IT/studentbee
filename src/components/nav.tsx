import Image from 'next/image'
import Link from 'next/link'
import UserInfo from './userInfo'
import ToolTips from './root/toolTips'
import Sidebar from './sidebar'
import { RightSide } from './clientNav'
import ArrowOutward from '@components/svg/arrowOutward'

// Displays the header
export default function Navbar() {
    return (
        <div className='flex justify-between bg-dark h-full w-full md:px-[2rem] gap-4 overflow-hidden'>
            <Sidebar />
            <ToolTips />
            {/* logo */}
            <div className='relative h-[var(--h-navbar)] w-[10rem] md:p-0'>
                <Link href='/' className='relative block h-[var(--h-navbar)] w-[var(--h-navbar)]'>
                    <Image 
                        src={'/images/logo/logo.svg'}
                        className='object-cover'
                        alt="logo" 
                        fill={true}
                     />
                </Link>
            </div>
            {/* Info for the user */}
            {/* <UserInfo /> */}
            {/* Links */}
            <nav className='hidden md:flex justify-between items-center w-fill max-w-[40rem]'>
                <Link href={'/scoreboard'}>
                    <li className='flex flex-row items-center list-none no-underline text-base leading-[1rem] p-3 font-medium cursor-pointer link--corner-hover'>
                        Scoreboard
                    </li>
                </Link>
                <Link href='/grades'>
                    <li className='flex flex-row items-center list-none no-underline text-base leading-[1rem] p-3 font-medium cursor-pointer link--corner-hover'>
                        Exam statistics
                    </li>
                </Link>
                <Link href='https://login.no'>
                    <li className='flex flex-row items-center list-none no-underline text-base leading-[1rem] p-3 pr-[1.5rem] font-medium cursor-pointer link--corner-hover'>
                        Login
                        <ArrowOutward className='absolute right-[0.25rem] w-[1.25rem] h-[1.25rem] fill-login'/>
                    </li>
                </Link>
            </nav>
            {/* account, login */}
            <RightSide />
        </div>
    )
}
