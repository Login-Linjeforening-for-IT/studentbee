import { humanizeTime } from '@utils/time'
import type { JSX } from 'react'

type ScoreBoardEntryProps = {
    user: ScoreboardProps
    index: number
}

export default function ScoreBoardEntry({ user, index }: ScoreBoardEntryProps): JSX.Element {
    const time = humanizeTime(user.time)
    const rank = index + 1

    let rankColor = 'text-login-200'
    if (index === 0) rankColor = 'text-yellow-500'
    else if (index === 1) rankColor = 'text-gray-400'
    else if (index === 2) rankColor = 'text-amber-600'
    else if (index < 10) rankColor = 'text-login'

    return (
        <tr className='bg-login-600 hover:bg-login-500/60 transition-colors border-b border-login-700 last:border-0'>
            <td className={`px-6 py-4 font-bold text-xl text-center ${rankColor}`}>#{rank}</td>
            <td className='px-6 py-4 font-medium text-login-50 truncate max-w-xs'>{user.name}</td>
            <td className='px-6 py-4 text-login-200 font-mono text-sm text-center'>{time}</td>
            <td className='px-6 py-4 font-bold text-login text-lg text-center'>{user.score}</td>
        </tr>
    )
}