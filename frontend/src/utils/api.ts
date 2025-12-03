'use server'

import {
    deleteWrapper,
    getWrapper,
    postWrapper,
    putWrapper,
} from './apiWrapper'

type ErrorResponse = {
    error: string
}

// User
export async function getUser(): Promise<UserProps | ErrorResponse> {
    return await getWrapper({ path: '/user' })
}

export async function deleteUser(): Promise<{ id: string } | ErrorResponse> {
    return await deleteWrapper({ path: '/user' })
}

// Courses
export async function getCourses(): Promise<Courses[] | ErrorResponse> {
    return await getWrapper({ path: '/courses' })
}

export async function getCourseByCode(id: string): Promise<Course | ErrorResponse> {
    return await getWrapper({ path: `/course/code/${id}` })
}

export async function getCourse(id: string): Promise<Course | ErrorResponse> {
    return await getWrapper({ path: `/course/${id}` })
}

export async function postCourse(data: PostCourse): Promise<{ id: string } | ErrorResponse> {
    return await postWrapper({ path: '/course', data })
}

export async function updateCourse({ course }: { course: Course }): Promise<{ id: string } | ErrorResponse> {
    return await putWrapper({ path: `/course/${course.id}`, data: { ...course } })
}

// Comments
export async function getComments(cardId: number): Promise<CardComment[] | ErrorResponse> {
    return await getWrapper({ path: `/comments/${cardId}` })
}

// Scoreboard
export async function getScoreboard(): Promise<ScoreboardProps[] | ErrorResponse> {
    return await getWrapper({ path: '/scoreboard' })
}

// Exam Grades
export async function getGrades(course: string): Promise<Grades | ErrorResponse> {
    return await getWrapper({ path: `/grades/${course}` })
}
