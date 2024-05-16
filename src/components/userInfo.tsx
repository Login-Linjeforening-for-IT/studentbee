'use client'

import getCookie from "@/utils/cookies"

export default function UserInfo() {
    const user: User = JSON.parse(getCookie('user') || '{ "name": "User"}')
    // const course = getcours
    const count = 59
    const goal = 100
    const time = 2000
    const timeAsHumanReadable = `${(time / 60).toFixed(0)}min ${time % 60}s`

    return (
        <div className='grid grid-cols-3 w-full h-full bg-gray-800 col-span-8 rounded-xl'>
            <h1 className='grid place-items-center text-xl text-gray-400'></h1>
            <h1 className='grid place-items-center text-2xl'>PROG1001</h1>
            <h1 className='grid place-items-center text-xl text-gray-400'>{timeAsHumanReadable}</h1>
        </div>
    )
}
