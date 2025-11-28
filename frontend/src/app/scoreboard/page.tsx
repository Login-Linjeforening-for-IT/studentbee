import { PageContainer } from 'uibee/components'
import { getScoreboard } from '@utils/api'
import ListHeader from '@components/scoreboard/listHeader'
import ScoreBoardEntry from '@components/scoreboard/scoreboardEntry'

export default async function Page() {
    const scoreboard = await getScoreboard()

    return (
        <PageContainer title='Scoreboard'>
            <div className='w-full h-full grid place-items-center'>
                {!Array.isArray(scoreboard) || scoreboard.length === 0
                    ? <h1>The scoreboard is empty.</h1>
                    :
                    <div className='flex flex-col w-full'>
                        <ListHeader />
                        {scoreboard.map((user: ScoreboardProps, index: number) =>
                            <ScoreBoardEntry key={index} user={user} index={index}  />
                        )}
                    </div>
                }
            </div>
        </PageContainer>
    )
}
