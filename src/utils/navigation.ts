import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { Dispatch, MutableRefObject, SetStateAction } from "react"
import getCookie from "./cookies"

type HandleNavigationProps = {
    direction: string
    current: number | undefined
    router: AppRouterInstance
    setAnimateAnswer: React.Dispatch<React.SetStateAction<string>>
    setSelected: React.Dispatch<React.SetStateAction<number>>
    checkAnswer: (input: number, attempted: number[], setAttempted: Dispatch<SetStateAction<number[]>>) => void
    id: string | undefined
    card: Card
    cards: Card[]
    selectedRef: MutableRefObject<number>
    attempted: number[]
    setAttempted: React.Dispatch<React.SetStateAction<number[]>>
}

type HandleKeyDownProps = {
    event: KeyboardEvent
    navigate: (direction: string) => void
}

type animate200msProps = {
    key: string
    setAnimateAnswer: React.Dispatch<React.SetStateAction<string>>
}

// Handles navigation for the cards component
export default function handleCardsNavigation({
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
}: HandleNavigationProps) {

        switch (direction) {
        case 'back': 
            if (current != undefined) {
                const previous = current === 0 ? 0 : current - 1
                router.push(`/course/${id}/${previous}`)
            }

            animate200ms({key: 'back', setAnimateAnswer})
            setSelected(-1)
            break
        case 'skip': 
            if (current != undefined) {
                const skip = (current + 1) % cards.length
                router.push(`/course/${id}/${skip}`)
            }

            animate200ms({key: 'skip', setAnimateAnswer})
            setSelected(-1)
            break
        case 'next':
            const autonextTime = localStorage.getItem('autonextTime') 
            
            if (autonextTime) {
                checkAnswer(Number(autonextTime), attempted, setAttempted)
                localStorage.removeItem('autonextTime')
                setSelected(-1)
            }

            checkAnswer(selectedRef.current, attempted, setAttempted)
            animate200ms({key: 'next', setAnimateAnswer})
            setSelected(-1)
            break
        case '1': 
            animate200ms({key: '0', setAnimateAnswer})
            checkAnswer(0, attempted, setAttempted)
            setSelected(-1)
            break
        case '2': 
            animate200ms({key: '1', setAnimateAnswer})
            checkAnswer(1, attempted, setAttempted)
            setSelected(-1)
            break
        case '3':
            animate200ms({key: '2', setAnimateAnswer})
            checkAnswer(2, attempted, setAttempted)
            setSelected(-1)
            break
        case '4': 
            animate200ms({key: '3', setAnimateAnswer})
            checkAnswer(3, attempted, setAttempted)
            setSelected(-1)
            break
        case '5': 
            animate200ms({key: '4', setAnimateAnswer})
            checkAnswer(4, attempted, setAttempted)
            setSelected(-1)
            break
        case '6': 
            animate200ms({key: '5', setAnimateAnswer})
            checkAnswer(5, attempted, setAttempted)
            setSelected(-1)
            break
        case '7': 
            animate200ms({key: '6', setAnimateAnswer})
            checkAnswer(6, attempted, setAttempted)
            setSelected(-1)
            break
        case '8': 
            animate200ms({key: '7', setAnimateAnswer})
            checkAnswer(7, attempted, setAttempted)
            setSelected(-1)
            break
        case '9': 
            animate200ms({key: '8', setAnimateAnswer})
            checkAnswer(8, attempted, setAttempted)
            setSelected(-1)
            break
        case '0': 
            animate200ms({key: '9', setAnimateAnswer})
            checkAnswer(9, attempted, setAttempted)
            setSelected(-1)
            break
        case 'w':
        case 'W':
        case 'up': 
            setSelected((prev) => (prev === card.alternatives.length - 1 ? 0 : prev + 1))
            break
        case 'down': 
            setSelected((prev) => (prev === 0 
                    ? card.alternatives.length - 1 
                    : prev - 1 >= 0 
                        ? prev - 1 
                        : card.alternatives.length - 1
            ))
            break
    }
}
    
export function handleKeyDown({event, navigate}: HandleKeyDownProps) {
    const typing = getCookie('typing')
    
    if (typing === 'true') {
        return
    }

    const activeElement = document.activeElement
    if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
        return
    }

    switch (event.key) {
        case 'd':
        case 'D':
        case 'ArrowRight': navigate('next'); break
        case 'a':
        case 'A':
        case 'b':
        case 'B':
        case 'ArrowLeft': navigate('back'); break
        case 's': 
        case 'S': navigate('skip'); break
        case '1': navigate("1"); break
        case '2': navigate("2"); break
        case '3': navigate("3"); break
        case '4': navigate("4"); break
        case '5': navigate("5"); break
        case '6': navigate("6"); break
        case '7': navigate("7"); break
        case '8': navigate("8"); break
        case '9': navigate("9"); break
        case '0': navigate("0"); break
        case 'Enter': navigate('next'); break
        case 'w':
        case 'ArrowUp': navigate('up'); break
        case 'W':
        case 'ArrowDown': navigate('down'); break
    }
}

export function animate200ms({key, setAnimateAnswer}: animate200msProps) {
    setAnimateAnswer(key)
    setTimeout(() => setAnimateAnswer("-1"), 200)
}
