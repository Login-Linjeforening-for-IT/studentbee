import ListHeader from "./listHeader"
import ScoreBoardEntry from "./scoreboardEntry"
import { getScoreBoard } from "@utils/fetch"

export default async function List(): Promise<JSX.Element> {
    const scoreboard = await getScoreBoard()

    if (scoreboard.length) {
        const cols = scoreboard.length > 1 ? 'grid-cols-2' : ''
        const span = scoreboard.length > 1 ? 'col-span-2' : ''

        return (
            <div className={`grid ${cols} w-full`}>
                <ListHeader userCount={scoreboard.length}/>
                <div className={`${span} grid grid-cols-2 space-x-4`}>
                    {scoreboard.map((user: ScoreBoardUser, index: number) => 
                        <ScoreBoardEntry key={user.id} user={user} index={index}  />
                    )}
                </div>
            </div>
        )
    }

    return <h1 className="w-full h-full grid place-items-center">The scoreboard is empty.</h1>
}