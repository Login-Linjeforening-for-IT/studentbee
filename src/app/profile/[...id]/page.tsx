import React from 'react'

// Main component of the program, holds the main page and the user can navigate
// to different pages from here
export default function Profile({ params }: { params: { id: string[] } }) {
    const id = params.id[0]

    return (
        <div className="w-full h-full rounded-xl">
            <h1 className='w-full h-full grid place-items-center text-2xl'>User: {id} (Profile coming soon)</h1>
        </div>
    )
}
