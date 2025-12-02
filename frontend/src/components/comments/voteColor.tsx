export default function voteColor(direction: 'up' | 'down', votes: Vote[], username: string, clientVote?: number) {

    if (Array.isArray(votes) && votes.length && direction === 'up') {
        if (votes.some(vote => vote.username === username && vote.vote) && clientVote === 0 || clientVote === 1) {
            return 'text-green-400/50'
        }

        return 'text-login-50 hover:text-green-400/50'
    }

    if (Array.isArray(votes) && votes.length && votes.some(vote => vote.username === username && !vote.vote) && clientVote === 0 || clientVote === -1) {
        return 'text-red-400/50'
    }

    return 'text-login-50 hover:text-red-400/50'
}
