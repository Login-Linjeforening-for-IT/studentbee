type CourseProps = {
    course: Course
    margin: boolean
}

type Course = {
    id: string
    flashcards: FlashCard[]
    unreviewed: FlashCardUnreviewed[]
}

type FlashCard = {
    question: string
    alternatives: string[]
    correct: number
}

type FlashCardUnreviewed = {
    question: string
    alternatives: string[] | undefined
    correct: number | undefined
}

type User = {
    id: number
    position: number
    name: string
    score: number
    time: number
    solved: UserSolved[]
}

type UserSolved = {
    id: string
    flashcards: number[]
}