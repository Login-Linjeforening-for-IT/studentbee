import Self from '@/components/profile/userClient'
import CourseList from '@/components/root/courses'
import { getUser } from '@/utils/fetch'
import React from 'react'

type OtherProps = {
    user: User | string
    id: string
}


// Main component of the program, holds the main page and the user can navigate
// to different pages from here
export default async function Profile({ params }: { params: { id: string[] } }) {
    const id = params.id[0]
    const user = await getUser(id)

    return (
        <div className="grid grid-cols-10 w-full h-full rounded-xl gap-8">
            <div className='col-span-2'>
                <CourseList />
            </div>
            <div className='w-full h-full grid place-items-center bg-dark rounded-xl col-span-8'>
                {typeof user === 'object' && id === user.username ? <Self user={user} /> : <Other id={id} user={user} />}
            </div>
        </div>
    )
}

function Other({user, id}: OtherProps) {

    if (typeof user === 'string') {
        return <h1 className='text-xl'>Unable to find {id}.</h1>
    }

    return (
        <h1 className='text-xl'>Viewing other users profile is coming soon.</h1>
    )
}