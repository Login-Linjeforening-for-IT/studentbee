'use client'

import getCookie from "@/utils/cookies"
import { useEffect, useState } from "react"

export default function ToolTips() {
    const [displayTips, setDisplayTips] = useState(false)
    const [autonext, setAutonext] = useState('off')

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const typing = getCookie('typing')
    
            if (typing === 'true') {
                return
            }

            if (e.key === 'q' || e.key === 'Q') {
                setDisplayTips(prevDisplayTips => !prevDisplayTips)
                localStorage.setItem('tooltips', 'false')
            }

            if (e.key === 't' || e.key === 'T') {
                const autonext = localStorage.getItem('autonext')
                localStorage.setItem('autonext', autonext === 'true' ? 'false' : 'true')
                setAutonext(autonext === 'true' ? 'off' : 'on')
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    useEffect(() => {
        function checkTooltips() {
            const tooltips = localStorage.getItem('tooltips')
            if (tooltips === 'true') {
                setDisplayTips(true)
            }
        }

        function handleStorageChange(e: Event) {
            const event = e as CustomEvent
            if (event.detail.key === 'tooltips') {
                setDisplayTips(event.detail.value === 'true')
            }
        }

        window.addEventListener('customStorageChange', handleStorageChange)

        checkTooltips()

        return () => {
            window.removeEventListener('customStorageChange', handleStorageChange)
        }
    }, [])

    if (!displayTips) {
        return <></>
    }

    return (
        <div className="w-full h-full absolute left-0 top-0 grid place-items-center bg-black bg-opacity-90" onClick={() => setDisplayTips(false)}>
            <div className="w-[55vw] h-[60vh] bg-normal rounded-xl p-8">
                <h1 className="w-full text-center text-xl font-semibold mb-4">Tooltips</h1>
                <div className="grid grid-cols-2">
                    <div className="w-full">
                        <Tips hotkey="Q" info="Displays this message" />
                        <Tips hotkey="W" info="Selects the first or next alternative" />
                        <Tips hotkey="A" info="Go to the previous question" />
                        <Tips hotkey="B" info="Go to the previous question" />
                        <Tips hotkey="S" info="Skip this question" />
                        <Tips hotkey="S" extraHotKey="Shift" info="Selects the last or previous alternative" />
                        <Tips hotkey="D" info="Submits the selected answer" />
                        <Tips hotkey="1" info="Selects and submits alternative 1" />
                        <Tips hotkey="2" info="Selects and submits alternative 2" />
                        <Tips hotkey="3" info="Selects and submits alternative 3" />
                        <Tips hotkey="4" info="Selects and submits alternative 4" />
                    </div>
                    <div className="w-full">
                        <Tips hotkey="ArrowUp" info="Selects the first or next alternative" />
                        <Tips hotkey="ArrowDown" info="Selects the last or previous alternative" />
                        <Tips hotkey="ArrowLeft" info="Go to the previous question" />
                        <Tips hotkey="ArrowRight" info="Submit the selected answer" />
                        <Tips hotkey="Enter" info="Submit the selected answer" />
                        <Tips hotkey="T" info={`Toggle autonext (currently ${autonext})`} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function Tips({hotkey, info, extraHotKey}: {hotkey: string, info: string, extraHotKey?: string}) {
    return (
        <div className="w-full p-2 flex flex-rows">
            {extraHotKey && <h1 className="text-sm px-2 bg-superlight rounded-md grid place-items-center mr-2">{extraHotKey}</h1>}
            {extraHotKey && <h1 className="text-sm grid place-items-center mr-2">+</h1>}
            <h1 className="text-sm px-2 bg-superlight rounded-md grid place-items-center mr-2">{hotkey}</h1>
            <h1 className="text-sm grid place-items-center">{info}</h1>
        </div>
    )
}