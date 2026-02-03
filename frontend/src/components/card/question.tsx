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
        <div className='w-full h-full bg-login-900 rounded-2xl p-6 md:p-8 flex flex-col shadow-sm border border-login-800/50'>
            <div className='relative w-full h-full overflow-auto mb-2 noscroll flex flex-col gap-4'>
                <div className="flex justify-between items-center w-full pb-4 border-b border-login-800/50 mb-2">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${card.answers.length > 1 ? 'bg-login-800 text-login-100 border-login-700' : 'bg-login-950 text-login-400 border-login-800'}`}>
                        {card.answers.length > 1 ? 'Multiple Choice' : 'Question'}
                    </span>
                    <h1 className='text-right text-login-400 font-mono text-xs tracking-wide'>
                        {card.source} • <span className="text-login-200">{(current || 0) + 1}</span> / {cards.length}
                    </h1>
                </div>

                <div className='mb-6'>
                    {card.answers.length > 1 && (
                        <h1 className='text-login-400 text-sm mb-2 italic'>
                            Select all correct answers
                        </h1>
                    )}

                    <div className="text-lg leading-relaxed text-login-200 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-login-50 [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-login-50 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_strong]:text-login-50 [&_strong]:font-bold [&_code]:bg-login-950 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-login-100 [&_code]:font-mono [&_code]:text-sm [&_pre]:bg-login-950 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-4 [&_a]:text-blue-400 [&_a]:underline hover:[&_a]:text-blue-300">
                        <Markdown
                            displayEditor={false}
                            handleDisplayEditor={() => {}}
                            markdown={card.question}
                        />
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-6">
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
                    <div className="mt-auto pt-4 border-t border-login-800/50">
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
                </div>
            </div>
        </div>
    )
}
