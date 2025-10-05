type ButtonsProps = {
    animateAnswer: string
    navigate: (direction: string) => void
    flashColor: string
}

export default function Buttons({animateAnswer, navigate, flashColor}: ButtonsProps) {
    const button = 'rounded-xl flex w-full p-2 bg-login-900 text-center justify-center'

    return (
        <div className='w-full flex gap-2 h-full'>
            <button
                className={`${button} ${animateAnswer === 'back' ? 'bg-login-700' : 'bg-login-900'}`}
                onClick={() => navigate('back')}
            >
                Back
            </button>
            <button
                className={`${button} ${animateAnswer === 'skip' ? 'bg-login-700' : 'bg-login-900'}`}
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
