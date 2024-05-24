import { MutableRefObject } from "react"
import { updateUserTime } from "./fetch"

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
        let time = stopFocusTime.getTime() - startFocusTime.current.getTime()
        startFocusTime.current = undefined
        updateUserTime({time})
    }
}
