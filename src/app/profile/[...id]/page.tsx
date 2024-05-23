import React from 'react'

// Main component of the program, holds the main page and the user can navigate
// to different pages from here
export default function Profile({ params }: { params: { id: string[] } }) {
    const id = params.id[0]

    return (
        <div className="w-full h-full rounded-xl overflow-auto grid grid-cols-10 gap-8 noscroll">
            <h1>User: {id}</h1>
        </div>
    )
}
