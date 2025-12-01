'use server'

import {
    deleteWrapper,
    getWrapper,
    postWrapper,
} from './apiWrapper'

type ErrorResponse = {
    error: string
}

// User
export async function getUser(): Promise<UserProps | ErrorResponse> {
    return getWrapper({ path: '/user' })
}

export async function deleteUser(): Promise<{ id: string } | ErrorResponse> {
    return deleteWrapper({ path: '/user' })
}

// Courses
export async function getCourses(): Promise<CoursesProps[] | ErrorResponse> {
    return getWrapper({ path: '/courses' })
}

export async function getCourse(id: string): Promise<CourseProps | ErrorResponse> {
    return getWrapper({ path: `/course/${id}` })
}

export async function postCourse({data}: { data: PostCourseProps }): Promise<{ id: string } | ErrorResponse> {
    return postWrapper({ path: '/course', data })
}

// Comments
export async function getComments(courseId: string): Promise<CardCommentProps[][] | ErrorResponse> {
    return getWrapper({ path: `/comments/${courseId}` })
}

// Scoreboard
export async function getScoreboard(): Promise<ScoreboardProps[] | ErrorResponse> {
    return getWrapper({ path: '/scoreboard' })
}

// Exam Grades
export async function getGrades(course: string): Promise<Grades | ErrorResponse> {
    return getWrapper({ path: `/grades/${course}` })
}
