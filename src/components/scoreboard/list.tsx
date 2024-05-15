import swap from "@/utils/swap"
import ListHeader from "./listHeader"
import ScoreBoardEntry from "./scoreboardEntry"
import getScoreBoard from "./getScoreBoard"

export default async function List(): Promise<JSX.Element> {
    const scoreboard = await getScoreBoard()

    if (scoreboard) {
        swap(scoreboard, 0, 10)
        const cols = scoreboard.length > 1 ? 'grid-cols-2' : ''

        return (
            <div className={`grid ${cols} w-full`}>
                <ListHeader userCount={scoreboard.length}/>
                {scoreboard.map((user) => {
                    return <ScoreBoardEntry key={user.account_id} user={user} userCount={scoreboard.length}/>
                })}
            </div>
        )
    }

    return <div/>
}