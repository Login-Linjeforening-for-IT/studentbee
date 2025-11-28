'use server'

import {
    deleteWrapper,
    getWrapper,
} from './apiWrapper'

type ErrorResponse = {
    error: string
}

//
export async function getUser(): Promise<UserProps | ErrorResponse> {
    return getWrapper({ path: '/user' })
}

export async function deleteUser(): Promise<{ id: string } | ErrorResponse> {
    return deleteWrapper({ path: '/user' })
}

// Scoreboard
export async function getScoreboard(): Promise<ScoreboardProps[] | ErrorResponse> {
    return getWrapper({ path: '/scoreboard' })
}