import { Dispatch, SetStateAction } from 'react'
import { Markdown } from '../editor/editor'
import Alternatives from './alternatives'
import QuestionFooter from './questionFooter'

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
    comments: CardComment[]
    showComments: boolean
    indexMapping: number[]
    shuffledAlternatives: string[]
    courseId: string
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
    comments,
    wait,
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
        <div className='w-full h-full min-h-[85vh] bg-login-900 rounded-lg pt-1 px-2 pb-2'>
            <div className='w-full h-full overflow-auto mb-2 noscroll'>
                <h1 className='text-right text-login-300 float-right'>
                    {card.source} {(current || 0) + 1} / {cards.length}
                </h1>
                <div className='mb-2'>
                    {card.answers.length > 1 && <h1 className='text-login-300'>
                        Multiple choice - Select all correct answers
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
                    answers={card.answers}
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
                comments={comments}
                remainGreen={remainGreen}
                handleVote={handleVote}
                setShowComments={setShowComments}
                showAnswers={showAnswers}
            />
        </div>
    )
}
