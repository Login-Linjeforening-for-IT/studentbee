import getItem from "@/utils/localStorage"

export default function voteColor(comment: CardComment, button: 'up' | 'down') {
    const user = getItem('user') as User
    
    if (button === 'up') {
        if (comment.votes.includes({userID: user.id, vote: true})) {
            return "fill-green-500"
        }

        return "fill-bright hover:fill-green-500"
    }

    if (button === 'down') {
        if (comment.votes.includes({userID: user.id, vote: false})) {
            return "fill-red-500"
        }

        return "fill-bright hover:fill-red-500"
    }
    
    return "fill-bright"
}