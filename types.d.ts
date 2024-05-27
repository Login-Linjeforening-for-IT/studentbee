type CourseProps = {
    course: CourseAsList
    margin: boolean
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
}

type CourseAsList = {
    id: string
    cards: Card[]
    count: number
}

type Card = {
    question: string
    alternatives: string[]
    correct: number
    help: string
    theme: string
}

type CardAsText = {
    input: string
}

type User = {
    id: number
    name: string
    username: string
    time: number
}

type LoggedInUser = {
    id: number
    name: string
    username: string
    time: number
}

type UserPage = {
    id: number
    username: string
    password: string
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

type RegisterUser = {
    username: string
    password: string
    firstName: string
    lastName: string
}

type LoginUser = {
    username: string
    password: string
}

type LoginResponse = {
    id: number
    name: string
    username: string
    token: string
    time: number
}

type ScoreBoardUser = {
    position: number
    account_id: number
    account_url: string
    name: string
    score: number
    time: number
}
