import PageClient from './pageClient'
import { getCourse } from '@utils/fetch'
import { cookies } from 'next/headers'

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const courseId = params.id.toUpperCase()
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value || ''
    const course = await getCourse('server', courseId, token)

    return <PageClient code={course.courseCode} id={courseId} />
}
