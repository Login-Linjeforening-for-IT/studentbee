import { getCourse } from "@/utils/fetch"

type ElementsProps = {
    id?: string
    current?: number
}

type Next10Props = {
    cards: Card[]
    current?: number
    amount: number
}

export default async function Elements({id, current}: ElementsProps) {
    const course = await getCourse(id || 'PROG1001')

    if (typeof course === 'string') {
        return (
            <div className="w-full h-full grid place-items-center">
                <h1 className="text-3xl">{course}</h1>
            </div>
        )
    }

    const amount = 10
    const cards = course.cards
    const help = current ? course.cards[current].help : null

    function Help() {
        if (help) {
            return (
                <div className="w-full h-full bg-gray-600 rounded-xl p-4 overflow-auto">
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
            <div className="w-full h-full rounded-xl p-4 overflow-auto">
                <h1 className="text-2xl mb-2">Upcoming</h1>
                <GetNextQuestions cards={cards} current={current} amount={amount} />
            </div>
        </div>
    )
}

// Gets the x next questions (max = amount)
function GetNextQuestions({cards, current, amount}: Next10Props) {
    const relevant = cards.slice(current, amount)

    return relevant.map((card) => 
        <div key={card.question} className={`w-full h-[5vh] bg-gray-700 rounded-xl mb-2 flex items-center pl-4`}>
            <h1>{card.question}</h1>
        </div>
    )
}