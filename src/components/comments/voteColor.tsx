export default function voteColor(direction: 'up' | 'down', votes: Vote[], username: string, clientVote?: number) {
    
    if (!username) {
        return "fill-bright"
    }

    if (direction === 'up') {
        if (votes.some(vote => vote.username === username && vote.vote) && clientVote === 0 || clientVote === 1) {
            return "fill-green-500"
        }

        return "fill-bright hover:fill-green-500"
    } 
    
    if (votes.some(vote => vote.username === username && !vote.vote) && clientVote === 0 || clientVote === -1) {
        return "fill-red-500"
    }

    return "fill-bright hover:fill-red-500"
}
