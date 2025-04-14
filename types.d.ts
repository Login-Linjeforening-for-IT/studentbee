type CourseProps = {
    course: CourseAsList
    currentPath: string
}

type Editing = {
    cards: Card[]
    texts: string[]
}

type Course = {
    id: string
    cards: Card[]
    unreviewed: Card[]
    textUnreviewed: string[]
    mark?: boolean
}

type CourseAsList = {
    id: string
    cards: Card[]
    count: number
}

type Card = {
    question: string
    alternatives: string[]
    source: string
    correct: number[]
    help?: string
    theme?: string
    rating: number
    votes: Vote[]
}

type CardAsText = {
    input: string
}

type User = {
    // From Authentik
    id: string
    name: string
    groups: string
    username: string
    token: string

    // From Firebase
    time: number
    score: number
    solved: UserSolved[]
}

type UserPage = {
    id: number
    username: string
    position: number
    name: string
    score: number
    time: number
    solved: UserSolved[]
}

type UserSolved = {
    id: string
    cards: number[]
}

type ScoreBoardUser = {
    id: number
    score: number
    solved: number
    name: string
    time: number
}

type CardComment = {
    id: number
    courseID: string
    cardID: number
    username: string
    content: string
    time: string
    rating: number
    replies?: CardComment[]
    votes: Vote[]
}

type Vote = {
    username: string
    vote: boolean
}

type Files = {
    name: string
    content: string
    files: Files[]
    parent?: string
}

type FileListProps = {
    files: Files[]
    path: string
    inputRef: RefObject<HTMLInputElement | null>
}

type ClientVote = {
    commentID: number
    vote: boolean
    isReply?: true
}

type RegisterUser = {
    id: string
    name: string
    username: string
}
