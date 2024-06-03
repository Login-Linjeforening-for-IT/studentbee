import { useEffect, useCallback, useRef, Dispatch, SetStateAction, MutableRefObject } from 'react'
import { useRouter } from 'next/navigation'
import handleCardsNavigation, { handleKeyDown } from "@utils/navigation"
import { focusCheck, windowFocused, windowUnfocused } from "@utils/focus"

type UseCardNavigationProps = {
    current: number | undefined
    id: string
    card: Card
    cards: Card[]
    setAnimate: Dispatch<SetStateAction<string>>
    setAnimateAnswer: Dispatch<SetStateAction<string>>
    setSelected: Dispatch<SetStateAction<number[]>>
    selectedRef: MutableRefObject<number[]>
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
    let startFocusTime = useRef<Date | undefined>(undefined)
    let lastUserInteraction = useRef<Date | undefined>(undefined)

    const checkAnswer = useCallback(
        (input: number[], attempted: number[], setAttempted: Dispatch<SetStateAction<number[]>>, next?: boolean) => {
            if (card.correct.every(answer => input.includes(answer)) || card.correct.every(answer => attempted.includes(answer)) || (remainGreen[0] === card.correct[0] && card.correct.length <= 1)) {
                if (current != undefined) {
                    const nextCard = current + 2 < cards.length ? current + 2 : 0
                    if (next && !wait) {
                        setAttempted([])
                        router.push(`/course/${id}/${nextCard}`)
                        setAnimate('correct')
                    } else if (next) {
                        setAttempted(prev => [...prev, ...input])
                    }
                }
            } else {
                !(card.correct.length > 1) && setAttempted(prev => [...prev, ...input])
                !attempted.every(answer => input.includes(answer)) && setAttempted(prev => [...prev, ...input])
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
        function focusHandler() {
            windowFocused({ lastUserInteraction, startFocusTime })
        }

        function unfocusedHandler() {
            windowUnfocused(startFocusTime)
        }

        window.addEventListener('focus', focusHandler)
        window.addEventListener('blur', unfocusedHandler)
        window.addEventListener('unload', unfocusedHandler)

        const interval = setInterval(focusCheck, 300 * 1000)

        return () => {
            window.removeEventListener('focus', focusHandler)
            window.removeEventListener('blur', unfocusedHandler)
            window.removeEventListener('unload', unfocusedHandler)
            clearInterval(interval)
        }
    }, [])

    useEffect(() => {
        function keyDownHandler(event: any) {
            handleKeyDown({ event, navigate })
        }

        window.addEventListener('keydown', keyDownHandler)
        return () => window.removeEventListener('keydown', keyDownHandler)
    }, [navigate])

    useEffect(() => {
        windowFocused({ lastUserInteraction, startFocusTime })
        return () => windowUnfocused(startFocusTime)
    }, [])

    useEffect(() => {
        windowFocused({ lastUserInteraction, startFocusTime })
    }, [])

    return { navigate, checkAnswer }
}
