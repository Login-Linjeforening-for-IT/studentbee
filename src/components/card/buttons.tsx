type ButtonsProps = {
    animateAnswer: string
    navigate: (direction: string) => void
    flashColor: string
}

export default function Buttons({animateAnswer, navigate, flashColor}: ButtonsProps) {
    const button = `rounded-xl flex w-full p-2 bg-darker text-center justify-center`

    return (
        <div className="w-full flex gap-2 h-full">
            <button 
                className={`${button} ${animateAnswer === 'back' ? "bg-light" : "bg-darker"}`}
                onClick={() => navigate('back')}
            >
                Back
            </button>
            <button 
                className={`${button} ${animateAnswer === 'skip' ? "bg-light" : "bg-darker"}`}
                onClick={() => navigate('skip')}
            >
                Skip
            </button>
            <button 
                className={`${button} ${flashColor}`}
                onClick={() => navigate('next')}
            >
                Next
            </button>
        </div>
    )
}
