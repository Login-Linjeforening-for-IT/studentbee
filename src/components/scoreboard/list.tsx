import swap from "@utils/swap"
import ListHeader from "./listHeader"
import ScoreBoardEntry from "./scoreboardEntry"
import { getScoreBoard } from "@/utils/fetch"

export default async function List(): Promise<JSX.Element> {
    const scoreboard = await getScoreBoard()

    if (scoreboard.length) {
        swap(scoreboard, 0, 10)
        const cols = scoreboard.length > 1 ? 'grid-cols-2' : ''

        return (
            <div className={`grid ${cols} w-full`}>
                <ListHeader userCount={scoreboard.length}/>
                {scoreboard.map((user: ScoreBoardUser) =>
                    <ScoreBoardEntry key={user.account_id} user={user} userCount={scoreboard.length}/>
                )}
            </div>
        )
    }

    return <h1 className="w-full h-full grid place-items-center">The scoreboard is empty.</h1>
}