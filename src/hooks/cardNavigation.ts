import { useEffect, useCallback, useRef, Dispatch, SetStateAction, MutableRefObject } from 'react'
import { useRouter } from 'next/navigation'
import handleCardsNavigation, { handleKeyDown } from "@utils/navigation"
import { focusCheck, windowFocused, windowUnfocused } from "@utils/focus"

type UseCardNavigationProps = {
    current: number | undefined
    id: string
    card: any
    cards: any[]
    setAnimate: Dispatch<SetStateAction<string>>
    setAnimateAnswer: Dispatch<SetStateAction<string>>
    setSelected: Dispatch<SetStateAction<number>>
    selectedRef: MutableRefObject<number>
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
}: UseCardNavigationProps) => {
    const router = useRouter()
    let startFocusTime = useRef<Date | undefined>(undefined)
    let lastUserInteraction = useRef<Date | undefined>(undefined)

    const checkAnswer = useCallback(
        (input: number) => {
            if (input === card.correct) {
                if (current != undefined) {
                    const next = current + 1 < cards.length ? current + 1 : -1
                    router.push(`/course/${id}/${next}`)
                }
                setAnimate('correct')
                setTimeout(() => setAnimate('-1'), 200)
            } else {
                setAnimate('wrong')
                setTimeout(() => setAnimate('-1'), 200)
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
            })
        },
        [current, router, setAnimateAnswer, setSelected, checkAnswer, id, card, cards, selectedRef]
    )

    useEffect(() => {
        const focusHandler = () => windowFocused({ lastUserInteraction, startFocusTime })
        const unfocusedHandler = () => windowUnfocused(startFocusTime)

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
        const keyDownHandler = (event: any) => handleKeyDown({ event, navigate })
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