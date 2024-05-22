import getCourseByID from "@/utils/getCourseByID"

type ElementsProps = {
    id?: string
    current?: number
}

type Next10Props = {
    cards: Card[]
    current?: number
    amount: number
}

export default function Elements({id, current}: ElementsProps) {
    const course = getCourseByID(id || "PROG1001")
    const amount = 10
    const cards = course.cards

    return (
        <div className='w-full h-full rounded-xl col-span-2 grid gap-8 overflow-hidden'>
            {course.help ? <div className="w-full h-full bg-gray-600 rounded-xl p-4 overflow-auto">
                <h1 className="text-2xl">Info</h1>
            </div> : null}
            <div className="w-full h-full rounded-xl p-4 overflow-auto">
                <h1 className="text-2xl mb-2">Upcoming</h1>
                <GetNextQuestions cards={cards} current={current} amount={amount} />
            </div>
        </div>
    )
}

// Gets the next 10 questions or however many are left
function GetNextQuestions({cards, current, amount}: Next10Props) {
    const relevant = cards.slice(current, amount)

    return relevant.map((card) => 
        <div className={`w-full h-[5vh] bg-gray-700 rounded-xl mb-2 flex items-center pl-4`}>
            <h1>{card.question}</h1>
        </div>
    )
}