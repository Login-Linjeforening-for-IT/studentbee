/**
 * Defines the Course type, used for type specification when handling courses
 */
type Course = {
    id: string
    cards: Card[]
    unreviewed: Card[]
    notes: string
    files: Files
}

/**
 * Files type, used for type specification when handling files
 */
type Files = {
    name: string
    content: string
    files: Files[]
    parent?: string
}

/**
 * Card type, used for type specification when creating cards
 */
type Card = {
    question: string
    alternatives: string[]
    correct: number[]
    source: string
    rating: number
    votes: Vote[]
    help?: string
    theme?: string
}
