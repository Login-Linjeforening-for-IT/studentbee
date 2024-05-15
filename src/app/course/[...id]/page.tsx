import React from 'react';
import Courses from '@/components/root/courses';
import Flashcards from '@/components/root/flashcards';
import Elements from '@/components/root/elements';

// Main component of the program, holds the main page and the user can navigate
// to different pages from here
export default async function Course({ params }: { params: { id: string[] } }) {
    const id = params.id[0]

    return (
        <div className="w-full h-full rounded-xl overflow-auto grid grid-cols-10 gap-8 noscroll">
            <Courses />
            <Flashcards id={id} />
            <Elements />
        </div>
    );
}
