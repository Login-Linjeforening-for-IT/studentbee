import { Dispatch, SetStateAction } from "react"
import { Markdown } from "../editor/editor"
import Alternatives from "./alternatives"
import QuestionFooter from "./questionFooter"

type QuestionProps = {
    card: Card
    cards: Card[]
    current: number | undefined
    selected: number[]
    setSelected: Dispatch<SetStateAction<number[]>>
    animateAnswer: string
    checkAnswer: (
        input: number[], 
        attempted: number[], 
        setAttempted: Dispatch<SetStateAction<number[]>>
    ) => void
    attempted: number[]
    setAttempted: Dispatch<SetStateAction<number[]>>
    remainGreen: number[]
    setRemainGreen: Dispatch<SetStateAction<number[]>>
    wait: boolean
    clientVote: 1 | 0 | -1
    handleVote: (vote: boolean) => void
    showComments: boolean
    setShowComments: Dispatch<SetStateAction<boolean>>
    totalCommentsLength: number
    showAnswers: () => void
}

export default function Question({
    animateAnswer, 
    attempted, 
    card, 
    cards, 
    clientVote, 
    current, 
    remainGreen, 
    selected, 
    showComments, 
    totalCommentsLength, 
    wait, 
    checkAnswer, 
    handleVote, 
    setSelected, 
    setAttempted, 
    setRemainGreen,
    setShowComments,
    showAnswers
}: QuestionProps) {
    return (
        <div className={`w-full h-full row-span-9 bg-dark rounded-xl p-8 pb-10`}>
            <div className="w-full h-full overflow-auto mb-2 noscroll">
                <div className="w-full">
                    <h1 className="text-right text-gray-500 float-right">
                        {card.source} {(current || 0) + 1} / {cards.length}
                    </h1>
                    <div className={`text-md mb-8 overflow-auto`}>
                    {card.correct.length > 1 && <h1 className="text-bright">
                        Multiple choice - Select all correct answers
                    </h1>}
                    {card.theme && <h1 className="text-lg text-gray-500">
                        {card.theme}
                    </h1>}
                    <Markdown
                        displayEditor={false} 
                        handleDisplayEditor={() => {}} 
                        markdown={card.question} 
                    />
                    </div>
                </div>
                <Alternatives
                    alternatives={card.alternatives}
                    selected={selected}
                    setSelected={setSelected}
                    animateAnswer={animateAnswer} 
                    checkAnswer={checkAnswer}
                    attempted={attempted}
                    setAttempted={setAttempted}
                    correct={card.correct}
                    remainGreen={remainGreen}
                    setRemainGreen={setRemainGreen}
                    wait={wait}
                />
            </div>
            <QuestionFooter
                card={card} 
                clientVote={clientVote} 
                handleVote={handleVote} 
                showComments={showComments} 
                setShowComments={setShowComments}
                totalCommentsLength={totalCommentsLength}
                showAnswers={showAnswers}
                wait={wait}
                remainGreen={remainGreen}
            />
        </div>
    )
}
