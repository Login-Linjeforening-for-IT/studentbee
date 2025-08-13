import type { JSX } from "react"
export default function ListHeader({userCount}: {userCount: number}): JSX.Element {
    
    return (
        <div className="grid md:grid-cols-2 md:col-span-2">
            <HeaderItem className="hidden md:grid mr-2" />
            <HeaderItem className="md:ml-2" />
        </div>
    )
}

function HeaderItem({className}: {className: string}) {
    return (
        <div className={`grid bg-darker mb-2 pt-2 pb-2 grid-cols-4 place-items-center rounded-xl ${className} font-semibold`}>
            <h1>Place</h1>
            <h1>User</h1>
            <h1>Time</h1>
            <h1>Score</h1>
        </div>
    )
}