import React from 'react'
import Courses from '@components/root/courses'
import Cards from '@components/root/cards'
import Elements from '@components/root/elements'

// Main component of the program, holds the main page and the user can navigate
// to different pages from here
export default async function Home() {

    return (
        <div className="w-full h-full rounded-xl overflow-auto grid grid-cols-10 gap-8 noscroll">
            <Courses />
            <Cards />
            <Elements />
        </div>
    );
}
