'use client'

import { Search } from 'lucide-react'
import {useRouter} from 'next/navigation'
import { useState } from 'react'

export default function Input({ course }: { course: string }) {
    const [searchValue, setSearchValue] = useState<string>(course)

    const router = useRouter()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(searchValue)
        }
    }

    const handleSearch = (value: string) => {
        router.push(`/grades/${value.toUpperCase()}`)
    }

    return (
        <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5' />
            <input
                type='text'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => handleSearch(searchValue)}
                placeholder='Search for course...'
                className='pl-10 pr-4 py-2 border-b outline-none w-64'
            />
        </div>
    )
}