import { useRouter } from 'next/navigation'

type ElementsProps = {
    id?: string
    current?: number
    course: Course | null
}

type QuestionsProps = {
    cards: Card[]
    current?: number
    id?: string
}

export default function Elements({ id, current, course }: ElementsProps) {
    const error = !course ? 'No course selected' : course.id.toString()

    if (!course) {
        return (
            <div className='col-span-2 bg-login-100/10 backdrop-blur-md border border-login-100/20 rounded-2xl shadow-lg p-8 px-100 w-full max-w-md text-center gap-6 grid place-items-center self-center'>
                <h1 className='text-lg font-semibold'>Questions Unavailable</h1>
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
                <div className='w-full h-full bg-login-900 rounded-2xl p-6 overflow-auto noscroll border border-login-800 shadow-sm'>
                    <h1 className='text-xl font-bold text-login-100 mb-4'>Info</h1>
                    <div className='h-full w-full text-login-300 leading-relaxed'>
                        {help}
                    </div>
                </div>
            )
        }

        return null
    }

    return (
        <div className='hidden xl:inline-flex! flex-col w-full rounded-lg col-span-2 overflow-hidden'>
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
        <div className='flex flex-col gap-4 p-1'>
            <h1 className='text-lg font-semibold text-login-100 pl-1'>Questions</h1>
            <div className='flex flex-col gap-2'>
                {relevant.map((card, i) => {
                    const index = i + 1 + cards.length - relevant.length
                    const isActive = current === index - 1

                    return (
                        <button
                            onClick={() => router.push(`/course/${id}/${index}`)}
                            key={i}
                            className={`
                                group relative w-full px-4 py-3 cursor-pointer rounded-xl flex items-center transition-all duration-200
                                ${isActive ? 'bg-login-800 border-l-4 border-l-login shadow-md' : 'bg-login-900/50 hover:bg-login-800/80 hover:pl-5'}
                            `}
                        >
                            <div className='flex justify-between w-full items-center gap-4'>
                                <span className={`text-sm text-left truncate flex-1 ${isActive ? 'text-login-50 font-medium' : 'text-login-300 group-hover:text-login-100'}`}>
                                    {card.question}
                                </span>
                                <span className={`text-xs font-mono min-w-6 text-right ${isActive ? 'text-login' : 'text-login-600'}`}>
                                    {index}
                                </span>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
