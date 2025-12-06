export default function voteColor(direction: 'up' | 'down', clientVote?: number) {

    if (direction === 'up') {
        if (clientVote === 1) {
            return 'text-green-400/50'
        }

        return 'text-login-50 hover:text-green-400/50'
    }

    if (clientVote === -1) {
        return 'text-red-400/50'
    }

    return 'text-login-50 hover:text-red-400/50'
}
