export default function voteColor(direction: 'up' | 'down', votes: Vote[], username: string, clientVote?: number) {

    // if (!username) {
    //     return 'text-login-50'
    // }

    if (direction === 'up') {
        if (votes.some(vote => vote.vote_by === username && vote.vote) && clientVote === 0 || clientVote === 1) {
            return 'text-green-400/50'
        }

        return 'text-login-50 hover:text-green-400/50'
    }

    if (votes.some(vote => vote.vote_by === username && !vote.vote) && clientVote === 0 || clientVote === -1) {
        return 'text-red-400/50'
    }

    return 'text-login-50 hover:text-red-400/50'
}
