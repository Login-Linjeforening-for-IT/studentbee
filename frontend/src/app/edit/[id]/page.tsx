import { getCourseByCode } from '@utils/api'
import PageClient from './pageClient'

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const courseId = params.id.toUpperCase()
    const course = await getCourseByCode(courseId)

    if (typeof course === 'string' || 'error' in course) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <div className={`
                    bg-login-100/10 backdrop-blur-md border border-login-100/20
                    rounded-2xl shadow-lg p-8 px-100 w-full max-w-md text-center
                    flex flex-col items-center gap-4'
                `}>
                    <h1>Course not found.</h1>
                </div>
            </div>
        )
    }

    return <PageClient course={course} id={courseId} />
}
