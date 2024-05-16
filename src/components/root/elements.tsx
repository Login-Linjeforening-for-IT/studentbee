import getCourseByID from "@/utils/getCourseByID"


type ElementsProps = {
    id?: string
    current?: number
}

type Next10Props = {
    flashcards: FlashCard[]
    current?: number
    amount: number
}

export default function Elements({id, current}: ElementsProps) {
    const course = getCourseByID(id || "PROG1001")
    const amount = 10
    const flashcards = course.flashcards

    return (
        <div className='w-full h-full rounded-xl col-span-2 grid grid-rows-2 gap-8 overflow-auto'>
            <div className="w-full h-full bg-green-500 rounded-xl p-4">
                <h1 className="text-2xl">Help</h1>
            </div>
            <div className="w-full h-full bg-blue-500 rounded-xl p-4 overflow-auto">
                <h1 className="text-2xl">Next question</h1>
                <GetNextQuestions flashcards={flashcards} current={current} amount={amount} />
            </div>
        </div>
    )
}

// Gets the next 10 questions or however many are left
function GetNextQuestions({flashcards, current, amount}: Next10Props) {
    const relevant = flashcards.slice(current, amount)

    return (
        <div className={`w-full h-[5vh] bg-gray-700 rounded-xl mb-4 flex items-center pl-4`}>
            {relevant.map((card) => <h1>{card.question}</h1>)}
        </div>
    )
}