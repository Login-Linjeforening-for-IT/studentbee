'use client'

import { useEffect, useState } from "react"

export default function ToolTips() {
    const [displayTips, setDisplayTips] = useState(false)
    const [autonext, setAutonext] = useState('off')

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'q' || e.key === 'Q') {
                setDisplayTips(prevDisplayTips => !prevDisplayTips)
            }

            if (e.key === 't' || e.key === 'T') {
                const autonext = localStorage.getItem('autonext')
                localStorage.setItem('autonext', autonext === 'true' ? 'false' : 'true')
                setAutonext(autonext === 'true' ? 'off' : 'on')
            }
        }

        window.addEventListener('keypress', handleKeyPress)

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keypress', handleKeyPress)
        }
    }, [])

    if (!displayTips) {
        return <></>
    }

    return (
        <div className="w-full h-full absolute left-0 top-0 grid place-items-center bg-black bg-opacity-90" onClick={() => setDisplayTips(false)}>
            <div className="w-[35vw] h-[75vh] bg-gray-800 rounded-xl p-8">
                <h1 className="w-full text-center text-xl font-semibold">Tooltips</h1>
                <Tips hotkey="Q" info="Displays this message" />
                <Tips hotkey="W" info="Selects the first or next alternative" />
                <Tips hotkey="A" info="Go to the previous question" />
                <Tips hotkey="B" info="Go to the previous question" />
                <Tips hotkey="S" info="Skip this question" />
                <Tips hotkey="D" info="Submits the selected answer" />
                <Tips hotkey="1" info="Selects and submits alternative 1" />
                <Tips hotkey="2" info="Selects and submits alternative 2" />
                <Tips hotkey="3" info="Selects and submits alternative 3" />
                <Tips hotkey="4" info="Selects and submits alternative 4" />
                <Tips hotkey="ArrowUp" info="Selects the first or next alternative" />
                <Tips hotkey="ArrowDown" info="Selects the last or previous alternative" />
                <Tips hotkey="ArrowLeft" info="Go to the previous question" />
                <Tips hotkey="ArrowRight" info="Submit the selected answer" />
                <Tips hotkey="Enter" info="Submit the selected answer" />
                <Tips hotkey="T" info={`Toggle autonext (currently ${autonext})`} />
            </div>
        </div>
    )
}

function Tips({hotkey, info}: {hotkey: string, info: string}) {
    return (
        <div className="w-full p-2 flex flex-rows">
            <h1 className="text-lg px-2 bg-gray-500 rounded-lg grid place-items-center mr-2">{hotkey}</h1>
            <h1 className="text-lg grid place-items-center">{info}</h1>
        </div>
    )
}