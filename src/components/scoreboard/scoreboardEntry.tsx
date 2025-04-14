import type { JSX } from "react";
type ScoreBoardEntryProps = {
    user: ScoreBoardUser
    index: number
}

export default function ScoreBoardEntry({user, index}: ScoreBoardEntryProps): JSX.Element {
    const backgroundColors: { [key: number]: string } = { 
        0: 'bg-[#FFD700]',
        1: 'bg-[#c0c0c0]',
        2: 'bg-[#cd7f32]'
    }
    
    // Checks if the user is top 3, if so gives gold, silver or bronze color, 
    // otherwise checks if its top 10 for blue, or anything else for gray
    const backgroundColor = backgroundColors[index] || ((index >= 4 && index <= 10) ? 'bg-[#152238]' : 'bg-light')

    return (
        <div className={`grid grid-cols-4 place-items-center ${backgroundColor} pt-2 pb-2 mb-2 ${index < 4 ? 'font-semibold text-white':''} ${index % 2 === 0 ? 'md:mr-2' : 'md:ml-2'} rounded-xl`}>
            <h1>{index + 1}</h1>
            <h1>{user.name}</h1>
            <h1>{user.time}</h1>
            <h1>{user.score}</h1>
        </div>
    )
}
