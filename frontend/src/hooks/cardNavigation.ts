import { useRouter } from 'next/navigation'
import handleCardsNavigation, { handleKeyDown } from '@parent/src/utils/navigation'
import {
    useEffect,
    useCallback,
    Dispatch,
    SetStateAction,
    RefObject,
} from 'react'
import { updateScore } from '@utils/api'

type UseCardNavigationProps = {
    current: number | undefined
    id: string
    card: Card
    cards: Card[]
    setAnimate: Dispatch<SetStateAction<string>>
    setAnimateAnswer: Dispatch<SetStateAction<string>>
    setSelected: Dispatch<SetStateAction<number[]>>
    selectedRef: RefObject<number[]>
    attempted: number[]
    setAttempted: Dispatch<SetStateAction<number[]>>
    wait: boolean
    setWait: Dispatch<SetStateAction<boolean>>
    remainGreen: number[]
    indexMapping: number[]
}

export const useCardNavigation = ({
    current,
    id,
    card,
    cards,
    setAnimate,
    setAnimateAnswer,
    setSelected,
    selectedRef,
    attempted,
    setAttempted,
    wait,
    setWait,
    remainGreen,
    indexMapping
}: UseCardNavigationProps) => {
    const router = useRouter()
    // const startFocusTime = useRef<Date | undefined>(undefined)
    // const lastUserInteraction = useRef<Date | undefined>(undefined)

    const checkAnswer = useCallback(
        (input: number[], attempted: number[], setAttempted: Dispatch<SetStateAction<number[]>>, next?: boolean) => {
            if (card.answers.every(answer => input.includes(answer)) || card.answers.every(answer => attempted.includes(answer)) || (remainGreen[0] === card.answers[0] && card.answers.length <= 1)) {
                if (current != undefined) {
                    const nextCard = current + 2 <= cards.length ? current + 2 : 0
                    if (next && !wait) {
                        setAttempted([])
                        router.push(`/course/${id}/${nextCard}`)
                        setAnimate('correct')
                        updateScore()
                    } else if (next) {
                        setAttempted(prev => [...prev, ...input])
                    }
                }
            } else {
                if (!(card.answers.length > 1)) {
                    setAttempted(prev => [...prev, ...input])
                }
                if (!attempted.every(answer => input.includes(answer))) {
                    setAttempted(prev => [...prev, ...input])
                }
            }
        },
        [current, router, id, card, cards, setAnimate, wait, remainGreen]
    )

    const navigate = useCallback((direction: string) => {
        handleCardsNavigation({
            direction,
            current,
            router,
            setAnimateAnswer,
            setSelected,
            checkAnswer,
            id,
            card,
            cards,
            selectedRef,
            attempted,
            setAttempted,
            wait,
            setWait,
            indexMapping
        })
    },
    [current, router, setAnimateAnswer, setSelected, checkAnswer, id, card, cards, selectedRef, attempted, setAttempted, wait, setWait, indexMapping]
    )

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function keyDownHandler(event: any) {
            handleKeyDown({ event, navigate })
        }

        window.addEventListener('keydown', keyDownHandler)
        return () => window.removeEventListener('keydown', keyDownHandler)
    }, [navigate])

    return { navigate, checkAnswer }
}
