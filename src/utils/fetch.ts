import { API } from "@parent/constants"

export async function getScoreBoard() {
    const response = await fetch(`${API}/scoreboard`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        const data = await response.json()

        throw Error(data.error)
    }

    return await response.json()
}