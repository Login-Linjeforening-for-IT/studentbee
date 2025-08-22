import db from '../db'

const recentlyChecked = [] as { username: string, result: boolean, timestamp: string }[]

/**
 * Checks if a user is on the scoreboard, caching the result for 60 seconds to 
 * avoid frequent database queries.
 * 
 * @param username The username to check if the user is on the scoreboard
 * @returns True if the user is on the scoreboard, false otherwise
 */
export default async function isUserOnScoreboard(username: string): Promise<boolean> {
    if (recentlyChecked.some(user => user.username === username)) {
        const cachedResult = recentlyChecked.find(user => user.username === username)
        if (cachedResult && new Date().getTime() - new Date(cachedResult.timestamp).getTime() < 60000) {
            return cachedResult.result
        }
    }

    return db.collection('User').doc(username).get().then((snapshot: FirebaseFirestore.DocumentSnapshot) => {
        if (!snapshot.exists) {
            return false
        }

        const data = snapshot.data()
        const result = !!data && typeof data.score === 'number' && data.score > 0
        recentlyChecked.push({ username, result, timestamp: new Date().toISOString() })
        return result
    })
}
