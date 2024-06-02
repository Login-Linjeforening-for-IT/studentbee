import { Dispatch, SetStateAction } from "react";
import ThumbsDown from "../svg/thumbsdown";
import ThumbsUp from "../svg/thumbsup";

type QuestionFooterProps = {
    card: Card
    clientVote: 1 | 0 | -1
    handleVote: (vote: boolean) => void
    showComments: boolean
    setShowComments: Dispatch<SetStateAction<boolean>>
    totalCommentsLength: number
    showAnswers: () => void
    wait: boolean
    remainGreen: number[]
}

export default function QuestionFooter({
    card, 
    clientVote, 
    handleVote,
    showComments, 
    setShowComments, 
    totalCommentsLength, 
    showAnswers, 
    wait, 
    remainGreen
}: QuestionFooterProps) {
    const showAnswer = (wait || !(card.correct.length > 1)) 
        && !remainGreen.every(answer => card.correct.includes(answer))

    return (
        <div className="grid grid-cols-3 ">
            <div className="flex flex-rows space-x-2 mb-4">
                <h1 className="text-bright">
                    {card.rating + clientVote > 0 ? '+' : ''}
                    {card.rating + clientVote}
                </h1>
                <button className="w-[1.3vw]" onClick={() => handleVote(true)}>
                    <ThumbsUp 
                        fill={`${clientVote === 1 
                            ? "fill-green-500" 
                            : "fill-bright hover:fill-green-500"}`
                        } 
                        className="w-full h-full pt-[0.2vh]" 
                    />
                </button>
                <button className="w-[1.3vw]" onClick={() => handleVote(false)}>
                    <ThumbsDown 
                        fill={`${clientVote === -1 
                            ? "fill-red-500" 
                            : "fill-bright hover:fill-red-500"}`
                        } 
                        className="w-full h-full pt-[0.2vh]" 
                    />
                </button>
            </div>
            <button 
                className="pb-4 text-bright" 
                onClick={() => setShowComments(!showComments)}
            >
                {totalCommentsLength 
                    ? `View comments (${totalCommentsLength})` 
                    : "Add comment"
                } {showComments ? '▼' : '▲'}
            </button>
            {showAnswer && <div>
                <button 
                    className="w-full text-end text-bright" 
                    onClick={showAnswers}
                >
                    {card.correct.length > 1 ? "Show answers" : "Show answer"}
                </button>
            </div>}
        </div>
    )
}
