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
    setSelected: Dispatch<SetStateAction<number>>
    selectedRef: MutableRefObject<number>
    attempted: number[]
    setAttempted: Dispatch<SetStateAction<number[]>>
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
    setAttempted
}: UseCardNavigationProps) => {
    const router = useRouter()
    let startFocusTime = useRef<Date | undefined>(undefined)
    let lastUserInteraction = useRef<Date | undefined>(undefined)

    const checkAnswer = useCallback(
        (input: number, attempted: number[], setAttempted: Dispatch<SetStateAction<number[]>>) => {
            if (input === card.correct) {
                if (current != undefined) {
                    const next = current + 1 < cards.length ? current + 1 : -1
                    const autonext = localStorage.getItem('autonext')
                    const autonextTime = localStorage.getItem('autonextTime')

                    // Skips automatically if allowed, otherwise gives visual 
                    // input on first interaction and actually proceeds on the
                    // second interaction. Reset when the user navigates away 
                    if (autonext === 'true') {
                        setAttempted([])
                        router.push(`/course/${id}/${next}`)
                        setAnimate('correct')
                        localStorage.removeItem('autonextTime')
                        setTimeout(() => setAnimate('-1'), 400)
                    } else if (autonextTime === card.correct.toString()) {
                        setAttempted([])
                        router.push(`/course/${id}/${next}`)
                        setAnimate('correct')
                        localStorage.removeItem('autonextTime')
                    } else {
                        localStorage.setItem('autonextTime', input.toString())
                        setAnimate('correct')
                    }

                }
            } else {
                !attempted.includes(input) && attempted.push(input)
                setAnimate('wrong')
                setTimeout(() => setAnimate('-1'), 200)
                localStorage.removeItem('autonextTime')
            }
        },
        [current, router, id, card, cards, setAnimate]
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
                setAttempted
            })
        },
        [current, router, setAnimateAnswer, setSelected, checkAnswer, id, card, cards, selectedRef, attempted, setAttempted]
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