import { Dispatch, SetStateAction } from "react"
import { Markdown } from "../editor/editor"
import Alternatives from "./alternatives"
import QuestionFooter from "./questionFooter"
import Link from "next/link"

type QuestionProps = {
    card: Card
    cards: Card[]
    current: number | undefined
    selected: number[]
    animateAnswer: string
    attempted: number[]
    remainGreen: number[]
    wait: boolean
    clientVote: 1 | 0 | -1
    showComments: boolean
    totalCommentsLength: number
    indexMapping: number[]
    shuffledAlternatives: string[]
    courseID: string
    setAttempted: Dispatch<SetStateAction<number[]>>
    setSelected: Dispatch<SetStateAction<number[]>>
    setRemainGreen: Dispatch<SetStateAction<number[]>>
    handleVote: (vote: boolean) => void
    setShowComments: Dispatch<SetStateAction<boolean>>
    showAnswers: () => void
    checkAnswer: (
        input: number[], 
        attempted: number[], 
        setAttempted: Dispatch<SetStateAction<number[]>>
    ) => void
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
    courseID,
    checkAnswer, 
    handleVote, 
    setSelected, 
    setAttempted, 
    setRemainGreen,
    setShowComments,
    showAnswers,
    indexMapping,
    shuffledAlternatives
}: QuestionProps) {
    return (
        <div className={`w-full h-full row-span-9 bg-dark rounded-xl p-8 pb-10`}>
            <div className="w-full h-full overflow-auto mb-2 noscroll">
                <h1 className="text-right text-bright float-right">
                    {card.source} {(current || 0) + 1} / {cards.length}
                </h1>
                <div className={`text-md mb-2`}>
                    {card.correct.length > 1 && <h1 className="text-bright">
                        Multiple choice - Select all correct answers
                    </h1>}
                    {card.correct.length > 1 && <h1 className="text-right text-bright underline float-right">
                        <a href={`../../grades/${courseID}`}>Exam statistics</a>
                    </h1>}
                    {card.theme && <h1 className="text-bright">
                        {card.theme}
                    </h1>}
                    {card.correct.length <= 1 && <h1 className="text-right text-bright underline float-right">
                        <Link href={`../../grades/${courseID}`}>Exam statistics</Link>
                    </h1>}
                    
                    <Markdown
                        displayEditor={false} 
                        handleDisplayEditor={() => {}} 
                        markdown={card.question} 
                    />
                </div>
                <Alternatives
                    selected={selected}
                    animateAnswer={animateAnswer} 
                    attempted={attempted}
                    correct={card.correct}
                    remainGreen={remainGreen}
                    wait={wait}
                    setSelected={setSelected}
                    checkAnswer={checkAnswer}
                    setAttempted={setAttempted}
                    setRemainGreen={setRemainGreen}
                    indexMapping={indexMapping}
                    shuffledAlternatives={shuffledAlternatives}
                />
            </div>
            <QuestionFooter
                card={card} 
                clientVote={clientVote} 
                showComments={showComments} 
                totalCommentsLength={totalCommentsLength}
                remainGreen={remainGreen}
                handleVote={handleVote} 
                setShowComments={setShowComments}
                showAnswers={showAnswers}
            />
        </div>
    )
}
