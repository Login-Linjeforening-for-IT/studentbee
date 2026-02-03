type ButtonsProps = {
    animateAnswer: string
    navigate: (direction: string) => void
    flashColor: string
}

export default function Buttons({ animateAnswer, navigate, flashColor }: ButtonsProps) {
    const button = 'rounded-xl flex w-full p-4 font-medium text-lg transition-all duration-200 shadow-sm border items-center justify-center'

    return (
        <div className='w-full flex gap-4 mt-2'>
            <button
                className={`${button} ${animateAnswer === 'back' ? 'bg-login-800 border-login-600 scale-95' : 'bg-login-900 border-login-800 hover:bg-login-800 text-login-300'}`}
                onClick={() => navigate('back')}
            >
                Back
            </button>
            <button
                className={`${button} ${animateAnswer === 'skip' ? 'bg-login-800 border-login-600 scale-95' : 'bg-login-900 border-login-800 hover:bg-login-800 text-login-300'}`}
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
