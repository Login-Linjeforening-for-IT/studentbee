import Link from 'next/link'
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
                <div className="w-full h-full bg-darker rounded-xl p-2 overflow-auto noscroll">
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
        <div className='hidden xl:inline-flex flex-col w-full rounded-xl col-span-2 overflow-hidden'>
            <Help />
            <div className="w-full h-full rounded-xl">
                <GetQuestions cards={cards} current={current} id={id} />
            </div>
        </div>
    )
}

// Gets all the course questions
function GetQuestions({cards, current, id}: QuestionsProps) {
    const router = useRouter()
    const remaining = cards.length - (current || 0);
    const count = remaining > 9
        ? 7
        : Math.min(15, 7 + (9 - remaining))

    const relevant = cards.slice(Math.max(0, (current || 0) - count))

    if (!cards.length) {
        return
    }

    return (
        <div className="flex flex-col gap-[0.2rem]">
            <h1 className="text-lg">Questions</h1>
            <div className="flex flex-col gap-2">
                {relevant.map((card, i) => {
                    const index = i + 1 + cards.length - relevant.length
                    const outline = current === index - 1 ? "outline-gray-500 scale-[0.99]" : "outline-hidden"
                    return (
                        <button 
                            onClick={() => router.push(`/course/${id}/${index}`)} 
                            key={i} 
                            className={`relative w-full px-3 py-[0.52rem] bg-darker cursor-pointer rounded-xl outline outline-1 ${outline} hover:outline-white flex items-center ${index === cards.length ? "-top-[1px]" : ""}`}
                        >
                            <div className="grid grid-cols-12 w-full">
                                <h1 className="text-md text-left w-full col-span-11">{card.question.slice(0, 25)}{card.question.length > 25 && '...'}</h1>
                                <h1 className="text-extralight text-right w-full">{index}</h1>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}