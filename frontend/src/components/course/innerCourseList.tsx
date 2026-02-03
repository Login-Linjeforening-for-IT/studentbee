import ListCourse from './listCourse'

export default function InnerCourseList({ courses, currentPath }: CoursesListProps) {
    return (
        <div className='h-full bg-login-900 rounded-2xl border border-login-800/50 shadow-sm overflow-hidden flex flex-col'>
            <div className='h-full overflow-auto noscroll p-2 flex flex-col gap-1'>
                {courses.map((course) =>
                    <ListCourse key={course.id} course={course} currentPath={currentPath} />
                )}
            </div>
        </div>
    )
}
