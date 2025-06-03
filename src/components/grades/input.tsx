'use client'

import {useRouter} from 'next/navigation'
import { useState } from 'react'
import Search from '../svg/search'

export default function Input({ course }: { course: string }) {
    const [input, setInput] = useState<string>(course)

    const router = useRouter()

    return (
        <div className='relative flex flex-row items-center w-[15rem] h-[2rem] mb-[2rem]'>
            <input 
                placeholder='Search' 
                value={input} 
                onChange={(e)=>setInput((e.target.value).toUpperCase())} 
                onKeyDown={(e)=>{if(e.key=='Enter')router.push(`/grades/${input}`)}} 
                className='absolute w-full h-full bg-darker rounded-md border-[1px] border-[rgb(44,44,44)] px-2 py-1 focus:outline-hidden focus:outline-white focus:outline-offset-1 '>
            </input>
            <button onClick={()=>{router.push(`/grades/${input}`)}} className='absolute h-[1.5rem] w-[1.5rem] right-1'><Search fill='fill-white' className='w-full h-full'/></button>
        </div>
    )
}