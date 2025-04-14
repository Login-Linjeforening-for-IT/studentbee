'use client'

import { useEffect, useState } from "react"

export default function ToolTips() {
    const [displayTips, setDisplayTips] = useState(false)

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const activeElement = document.activeElement
            if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
                return
            }

            if (e.key === 'q' || e.key === 'Q') {
                setDisplayTips(prevDisplayTips => !prevDisplayTips)
                localStorage.setItem('tooltips', 'false')
            }

            // if (e.key === 'n' && ) {
            //     setDisplayTips(false)
            // }
        }

        window.addEventListener('keydown', handleKeyDown)

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
        <div className="w-full h-full fixed left-0 top-0 grid place-items-center bg-black bg-opacity-90 z-10" onClick={() => setDisplayTips(false)}>
            <div className="w-[55vw] h-[63vh] bg-normal rounded-xl p-8 overflow-auto noscroll">
                <h1 className="w-full text-center text-xl font-semibold mb-2">Tooltips</h1>
                <div className="grid grid-cols-2">
                    <div className="w-full">
                        <Tips hotkey="Q" info="Displays this message" />
                        <Tips hotkey="W" info="Selects the first or next alternative" />
                        <Tips hotkey="A" info="Go to the previous question" />
                        <Tips hotkey="B" info="Go to the previous question" />
                        <Tips hotkey="P" info="Go to the previous question" />
                        <Tips hotkey="S" info="Skip this question" />
                        <Tips hotkey="S" extraHotKey="Shift" info="Selects the previous alternative" />
                        <Tips hotkey="D" info="Submits the selected answer" />
                    </div>
                    <div className="w-full">
                        <Tips hotkey="1-9" info="Selects and submits alternative 1-9" />
                        <Tips hotkey="0" info="Selects and submits alternative 10" />
                        <Tips hotkey="ArrowUp" info="Selects the first or next alternative" />
                        <Tips hotkey="ArrowDown" info="Selects the previous alternative" />
                        <Tips hotkey="ArrowLeft" info="Go to the previous question" />
                        <Tips hotkey="ArrowRight" info="Submit the selected answer" />
                        <Tips hotkey="Enter" info="Submit the selected answer" />
                        <Tips hotkey="N" info="Submit the selected answer" />
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