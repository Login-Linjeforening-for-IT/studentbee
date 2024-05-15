import { courses } from "@/app/data";

export default function getCourseByID(courseId: string): Course {
    const course = courses.find(c => c.id === courseId)

    if (!course) {
        return courses[0]
    }

    return course
}
