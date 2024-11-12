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

export default function Elements({id, current, course}: ElementsProps) {
    const error = typeof course === 'string' && id ? course : 'No course selected'

    if (typeof course === 'string') {
        return (
            <div className="hidden xl:grid w-full h-full rounded-xl col-span-2 gap-8 overflow-hidden">
                <h1 className="text-xl">{error}</h1>
            </div>
        )
    }

    if (current === -1) {
        return (
            <div className="hidden xl:grid w-full h-full rounded-xl col-span-2 gap-8 overflow-hidden">
                <h1 className="text-xl">Course complete.</h1>
            </div>
        )
    }

    const cards = course.cards
    const help = current ? course.cards[current]?.help : null

    function Help() {
        if (help) {
            return (
                <div className="w-full h-full bg-dark rounded-xl p-4 overflow-auto noscroll">
                    <h1 className="text-xl">Info</h1>
                    <div className="h-full w-full">
                        {help}
                    </div>
                </div>
            )
        }

        return null
    }

    return (
        <div className='hidden xl:grid w-full rounded-xl col-span-2 gap-8 overflow-hidden'>
            <Help />
            <div className="w-full h-full rounded-xl overflow-auto noscroll">
                <GetQuestions cards={cards} current={current} id={id} />
            </div>
        </div>
    )
}

// Gets all the courese questions
function GetQuestions({cards, current, id}: QuestionsProps) { 
    const relevant = cards.slice((current||0) > 4 ? (current||0)-5 : 0, (current||0)+6)
    const router = useRouter()

    if (!cards.length) {
        return
    }

    return (
        <div className='p-2'>
            <h1 className="text-xl mb-2">Questions</h1>
            {relevant.map((card, index) => {
                const outline = current==index ? "outline-gray-500" : "outline-none"
                return(
                <button onClick={() => router.push(`/course/${id}/${index+1}`)} key={card.question} className={`w-full pt-3 pb-3 bg-dark rounded-xl outline outline-1 ${outline} hover:outline-white mb-2 flex items-center p-2 pl-4`}>
                    <h1 className="text-sm">{card.question.slice(0, 30)}{card.question.length > 30 && '...'}</h1>
                </button>)
            })}
        </div>
    )
}