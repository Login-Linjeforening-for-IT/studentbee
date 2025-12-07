// User
type UserProps = {
    userId: string
    email: string
    name: string
    score: number
    time: number
    createdAt: string
    updatedAt: string
}

type Courses = {
    id: string
    name: string
    code: string
    cardCount: number
}

type PostCourse = {
    code: string
    name: string
}

// Cards
type Card = {
    id: number
    courseId: number
    question: string
    alternatives: string[]
    answers: number[]
    vote?: boolean | null
    source: string | null
    theme: string | null
    rating: number
    help: string | null
    createdBy: string | null
    createdAt: string
    updatedAt: string
}

// Comments
type CardComment = {
    id: number
    cardId: number | null
    parentId: number | null
    username: string
    rating: number
    username: string
    content: string
    createdAt: string
    updatedAt: string
    replies: CardComment[]
    votes: Vote[]
}

// Scoreboard
type ScoreboardProps = {
    name: string
    score: number
    time: number
}

// Exam Grades
type Status = {
    status: {
        tabell_id: number
        api_versjon: number
        leveransenr: number
        leveringstid: string
        antall: number
        'antall linjer anonymisert': number
        returkode: number
        melding: string
    }
}

type GradeDistribution = {
    Institusjonskode: string
    Institusjonsnavn: string
    Årstall: string
    Emnekode: string
    Karakter: string
    'Antall kandidater totalt': string
    'Antall kandidater kvinner': string
    'Antall kandidater menn': string
}

type Grades = (Status | GradeDistribution)[]

type Course = {
    id: number
    code: string
    name: string
    cards: Card[]
    notes: string
    learningBased: boolean
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
}

type CourseAsList = {
    id: string
    cards: Card[]
    count: number
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

    // From database
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
    username: number
    score: number
    solved: number
    name: string
    time: number
    seen: string
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
    commentId: number
    vote: boolean
    isReply?: true
}

type CoursesListProps = {
    courses: Courses[]
    currentPath: string
}
