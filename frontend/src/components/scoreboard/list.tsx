import { getScoreboard } from '@utils/api'
import ListHeader from './listHeader'
import ScoreBoardEntry from './scoreboardEntry'

import type { JSX } from 'react'

export default async function List(): Promise<JSX.Element> {
    const scoreboard = await getScoreboard()

    if (!Array.isArray(scoreboard) || scoreboard.length === 0) {
        return <h1 className='w-full h-full grid place-items-center'>The scoreboard is empty.</h1>
    }

    const cols = scoreboard.length > 1 ? 'md:grid-cols-2' : ''

    return (
        <div className={`grid ${cols} w-full`}>
            <ListHeader userCount={scoreboard.length}/>
            <div className={'grid col-span-2 md:grid-cols-2'}>
                {scoreboard.map((user: ScoreboardProps, index: number) =>
                    <ScoreBoardEntry key={index} user={user} index={index}  />
                )}
            </div>
        </div>
    )
}
