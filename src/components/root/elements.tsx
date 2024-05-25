import { getCourse } from "@/utils/fetch"

type ElementsProps = {
    id?: string
    current?: number
}

type NextQuestionProps = {
    cards: Card[]
    current?: number
    amount: number
}

export default async function Elements({id, current}: ElementsProps) {
    const course = await getCourse(id || 'PROG1001')
    const error = typeof course === 'string' && id ? course : 'No course selected'

    if (typeof course === 'string') {
        return (
            <div className="w-full h-full rounded-xl col-span-2 grid gap-8 overflow-hidden">
                <h1 className="text-xl">{error}</h1>
            </div>
        )
    }

    if (current === -1) {
        return (
            <div className="w-full h-full rounded-xl col-span-2 grid gap-8 overflow-hidden">
                <h1 className="text-xl">Course complete.</h1>
            </div>
        )
    }

    const amount = 12
    const cards = course.cards
    const help = current ? course.cards[current].help : null

    function Help() {
        if (help) {
            return (
                <div className="w-full h-full bg-gray-700 rounded-xl p-4 overflow-auto">
                    <h1 className="text-2xl">Info</h1>
                    <div className="h-full w-full bg-red-200">
                        {help}
                    </div>
                </div>
            )
        }

        return null
    }

    return (
        <div className='w-full h-full rounded-xl col-span-2 grid gap-8 overflow-hidden'>
            <Help />
            <div className="w-full h-full rounded-xl overflow-auto">
                <GetNextQuestions cards={cards} current={current} amount={amount} />
            </div>
        </div>
    )
}

// Gets the x next questions (max = amount)
function GetNextQuestions({cards, current, amount}: NextQuestionProps) {
    const relevant = cards.slice(current, (current || 0) + amount).slice(1)

    if (!relevant.length) {
        return <h1 className="text-2xl">Last question!</h1>
    }

    return (
        <div>
            <h1 className="text-2xl mb-2">Upcoming</h1>
            {relevant.map((card) => (
                <div key={card.question} className={`w-full h-[5vh] bg-gray-700 rounded-xl mb-2 flex items-center p-2 pl-4`}>
                    <h1 className="text-sm">{card.question.slice(0, 30)}{card.question.length > 30 && '...'}</h1>
                </div>
            ))}
        </div>
    )
}