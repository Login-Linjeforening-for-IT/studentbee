'use server'

import {
    getWrapper,
} from './apiWrapper'

type ErrorResponse = {
    error: string
}

// Scoreboard
export async function getScoreboard(): Promise<ScoreboardProps[] | ErrorResponse> {
    return getWrapper({ path: '/scoreboard' })
}
