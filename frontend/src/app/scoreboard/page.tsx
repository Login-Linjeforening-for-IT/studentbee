import { PageContainer } from 'uibee/components'
import { getScoreboard } from '@utils/api'
import ListHeader from '@components/scoreboard/listHeader'
import ScoreBoardEntry from '@components/scoreboard/scoreboardEntry'

export default async function Page() {
    const scoreboard = await getScoreboard()

    return (
        <PageContainer title='Scoreboard'>
            <div className='w-full h-full flex justify-start'>
                {!Array.isArray(scoreboard) || scoreboard.length === 0
                    ? <h1 className='text-login-200 mt-10 text-xl'>The scoreboard is empty.</h1>
                    :
                    <div className='w-full max-w-7xl mt-8 overflow-hidden rounded-lg border border-login-700 shadow-lg'>
                        <table className='w-full text-left border-collapse'>
                            <ListHeader />
                            <tbody className='divide-y divide-login-700'>
                                {scoreboard.map((user: ScoreboardProps, index: number) =>
                                    <ScoreBoardEntry key={index} user={user} index={index}  />
                                )}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </PageContainer>
    )
}
