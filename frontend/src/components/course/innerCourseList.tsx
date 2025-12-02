import ListCourse from './listCourse'

export default function InnerCourseList({ courses, currentPath }: CoursesListProps) {
    return (
        <div className='h-full bg-login-300/10 rounded-lg outline outline-login-300/20 backdrop-blur-md'>
            <div className='pb-24 h-full overflow-auto grow noscroll p-2'>
                {courses.map((course) =>
                    <ListCourse key={course.id} course={course} currentPath={currentPath} />
                )}
            </div>
        </div>
    )
}
