import { MutableRefObject } from "react"

type FocusCheckProps = {
    startFocusTime: MutableRefObject<Date | undefined>
    lastUserInteraction: MutableRefObject<Date | undefined>
}

type WindowFocusedProps = {
    lastUserInteraction: MutableRefObject<Date | undefined>
    startFocusTime: MutableRefObject<Date | undefined>
}

export function focusCheck({startFocusTime, lastUserInteraction}: FocusCheckProps) {
    if (startFocusTime.current != undefined) {
        let currentTime = new Date()
        if ((currentTime.getTime() - (lastUserInteraction.current?.getTime() || 0)) > (270 * 1000)) {
            windowUnfocused(startFocusTime)
        }
    }
}

export function windowFocused({lastUserInteraction, startFocusTime}: WindowFocusedProps) {
    lastUserInteraction.current = new Date()
    if (startFocusTime.current == undefined) {
        startFocusTime.current = new Date()
    }
}

export function windowUnfocused(startFocusTime: MutableRefObject<Date | undefined>) {
    if (startFocusTime.current != undefined) {
        let stopFocusTime = new Date()
        let totalFocusTime = stopFocusTime.getTime() - startFocusTime.current.getTime()
        startFocusTime.current = undefined
        let message = {
            type: "time_spent",
            domain: document.domain,
            time_spent: totalFocusTime
        }
        // Replace this with your logic to send the message, e.g., an API call
        // Update time spent in the database
        console.log(message)
    }
}