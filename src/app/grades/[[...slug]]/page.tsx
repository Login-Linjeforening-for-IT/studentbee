import { getGrades } from '@/utils/fetch'
import Input from '@/components/grades/input'
import ClientPage from './client'

export default async function Grades({ params }: { params: Promise<{ slug: string[] | undefined }> }) {
    const { slug } = await params

    const course = slug && slug[0] ? slug[0] : ''

    let grades = null
    let years = null
    let error = null

    const data = await getGrades(course) as any
    if (typeof data === 'string' && course.length) {
        error = 'No grades found'
    }

    const availableYears = []
    for (let i = 1; i < data.length; i++) {
        if (availableYears.indexOf(data[i].Årstall) === -1) {
            availableYears.push(data[i].Årstall)
        }
    }

    years = availableYears.reverse()
    const selectedYear = availableYears[0]

    const transformedData = {} as any
    for (let i = 0; i < availableYears.length; i++) {
        const year = availableYears[i]
        if (!transformedData[year]) {
            transformedData[year] = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 }
        }
        for (let j = 0; j < data.length; j++) {
            const item = data[j]
            if (item.Årstall === year) {
                const grade = item.Karakter
                const totalCandidates = parseInt(item['Antall kandidater totalt'], 10)
                if (transformedData[year][grade] !== undefined) {
                    transformedData[year][grade] += totalCandidates
                }
            }
        }
    }

    grades = transformedData

    return (
        <div className='grid place-items-center h-full]'>
            <div className='w-full h-full grid place-items-center'>
                <Input course={course} />

                {error && <p className='pt-8'>{error}</p>}

                {grades && selectedYear && years &&
                    <ClientPage grades={grades} years={years} defaultYear={selectedYear} />
                }
            </div>
        </div>
    )
}
