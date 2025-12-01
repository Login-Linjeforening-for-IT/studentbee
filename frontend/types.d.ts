// User
type UserProps = {
    user_id: string
    email: string
    name: string
    score: number
    total_time: number
    created_at: string
    updated_at: string
}

// Courses
type CourseProps = {
    id: number
    course_code: string
    name: string
    notes: string
    learning_based: boolean
    created_by: string | null
    created_at: string
    updated_by: string | null
    updated_at: string
    cards: GetCardsProps[]
}

type CoursesProps = {
    id: string
    name: string
    course_code: string
    card_count: number
}

type PostCourseProps = {
    id: string
    name: string
}

// Cards
type GetCardsProps = {
    id: number
    course_id: number
    question: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    alternatives: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    correct_answers: any
    source: string | null
    help: string | null
    created_by: string | null
    created_at: string
    updated_at: string
}

// Comments
type CardCommentProps = {
    id: number
    card_id: number | null
    parent_id: number | null
    user_id: number
    content: string
    created_at: string
    updated_at: string
    parent: number | null
    replies: CardCommentProps[]
}


// Scoreboard
type ScoreboardProps = {
    name: string
    score: number
    total_time: number
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



// Before rewrite
type Editing = {
    cards: Card[]
    notes: string
}

type Course = {
    id: string
    name: string
    cards: Card[]
    notes: string
    learningBased: boolean
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
    commentID: number
    vote: boolean
    isReply?: true
}