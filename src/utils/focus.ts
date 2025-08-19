import { RefObject } from "react"
import { updateUserTime } from "./fetch"

type FocusCheckProps = {
    startFocusTime: RefObject<Date | undefined>
    lastUserInteraction: RefObject<Date | undefined>
}

type WindowFocusedProps = {
    lastUserInteraction: RefObject<Date | undefined>
    startFocusTime: RefObject<Date | undefined>
}

// Check if the user has been inactive for more than 4.5 minutes
export function focusCheck({startFocusTime, lastUserInteraction}: FocusCheckProps) {
    if (!startFocusTime.current) {
        startFocusTime.current = new Date()
    }

    if (startFocusTime.current != undefined) {
        let currentTime = new Date()
        if ((currentTime.getTime() - (lastUserInteraction.current?.getTime() || 0)) > (270 * 1000)) {
            windowUnfocused(startFocusTime)
        }
    }
}

// Handler for window focus event to update the last user interaction time
export function windowFocused({lastUserInteraction, startFocusTime}: WindowFocusedProps) {
    lastUserInteraction.current = new Date()
    if (startFocusTime.current == undefined) {
        startFocusTime.current = new Date()
    }
}

// Handler for window unfocus event to update time spent on the page
export function windowUnfocused(startFocusTime: RefObject<Date | undefined>) {
    if (startFocusTime.current != undefined) {
        let stopFocusTime = new Date()
        let time = stopFocusTime.getTime() - startFocusTime.current.getTime()
        startFocusTime.current = undefined
        updateUserTime({time})
    }
}
