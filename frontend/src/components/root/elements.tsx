import { useRouter } from 'next/navigation'

type ElementsProps = {
    id?: string
    current?: number
    course: Course | string
}

type QuestionsProps = {
    cards: Card[]
    current?: number
    id?: string
}

export default function Elements({ id, current, course }: ElementsProps) {
    const error = typeof course === 'string' && id ? course : 'No course selected'

    if (typeof course === 'string') {
        return (
            <div className='col-span-2 bg-login-100/10 backdrop-blur-md border border-login-100/20 rounded-2xl shadow-lg p-8 px-100 w-full max-w-md text-center gap-6 grid place-items-center self-center'>
                <h1 className='text-xl font-semibold'>Questions Unavailable</h1>
                <h1 className='px-8'>The question list is currently unavailable. Please try again later.</h1>
                <h1 className='text-sm'>Details: {error}</h1>
            </div>
        )
    }

    if (current === -1) {
        return (
            <div className='hidden xl:grid w-full h-full rounded-lg col-span-6 gap-8 overflow-hidden'>
                <h1 className='text-xl'>Course complete.</h1>
            </div>
        )
    }

    const cards = course.cards
    const help = current ? course.cards[current]?.help : null

    function Help() {
        if (help) {
            return (
                <div className='w-full h-full bg-login-900 rounded-lg p-2 overflow-auto noscroll'>
                    <h1 className='text-xl'>Info</h1>
                    <div className='h-full w-full'>
                        {help}
                    </div>
                </div>
            )
        }

        return null
    }

    return (
        <div className='hidden xl:inline-flex flex-col w-full rounded-lg col-span-2 overflow-hidden'>
            <Help />
            <div className='w-full h-full rounded-lg'>
                <GetQuestions cards={cards} current={current} id={id} />
            </div>
        </div>
    )
}

// Gets all the course questions
function GetQuestions({ cards, current, id }: QuestionsProps) {
    const router = useRouter()
    const remaining = cards.length - (current || 0)
    const count = remaining > 9
        ? 7
        : Math.min(15, 7 + (9 - remaining))

    const relevant = cards.slice(Math.max(0, (current || 0) - count))

    if (!cards.length) {
        return
    }

    return (
        <div className='flex flex-col gap-[0.2rem]'>
            <h1 className='text-lg'>Questions</h1>
            <div className='flex flex-col gap-2'>
                {relevant.map((card, i) => {
                    const index = i + 1 + cards.length - relevant.length
                    const outline = current === index - 1 ? 'outline-gray-500 scale-[0.99]' : 'outline-hidden'
                    return (
                        <button
                            onClick={() => router.push(`/course/${id}/${index}`)}
                            key={i}
                            className={`relative w-full px-3 py-[0.52rem] bg-login-900 cursor-pointer rounded-lg outline-1 ${outline} hover:outline-white flex items-center ${index === cards.length ? '-top-px' : ''}`}
                        >
                            <div className='grid grid-cols-12 w-full'>
                                <h1 className='text-md text-left w-full col-span-11'>{card.question.slice(0, 25)}{card.question.length > 25 && '...'}</h1>
                                <h1 className='text-login-500 text-right w-full'>{index}</h1>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}