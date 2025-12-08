'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { updateTime } from '@utils/api'

export default function TimeTracker() {
    const pathname = usePathname()
    const accumulatedTimeRef = useRef(0)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastActivityRef = useRef(Date.now())
    const [isFocused, setIsFocused] = useState(true)

    const sendAccumulatedTime = async () => {
        if (accumulatedTimeRef.current > 0) {
            await updateTime(accumulatedTimeRef.current > 2 * 60 * 1000 ? 2 * 60 * 1000 : accumulatedTimeRef.current)
            accumulatedTimeRef.current = 0
        }
    }

    const startInterval = () => {
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                accumulatedTimeRef.current += 1000
                if (accumulatedTimeRef.current >= 2 * 60 * 1000) {
                    sendAccumulatedTime()
                }
            }, 1000)
        }
    }

    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    useEffect(() => {
        const handleFocus = () => {
            setIsFocused(true)
        }
        const handleBlur = () => {
            setIsFocused(false)
        }
        const handleVisibilityChange = () => {
            setIsFocused(!document.hidden)
        }

        window.addEventListener('focus', handleFocus)
        window.addEventListener('blur', handleBlur)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            window.removeEventListener('focus', handleFocus)
            window.removeEventListener('blur', handleBlur)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    useEffect(() => {
        if (pathname.includes('/course/')) {
            lastActivityRef.current = Date.now()
            if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current)
            }
            inactivityTimeoutRef.current = setTimeout(() => {
                stopInterval()
            }, 2 * 60 * 1000)
        } else {
            stopInterval()
            if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current)
            }
        }

        return () => {
            if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current)
            }
        }
    }, [pathname])

    useEffect(() => {
        if (isFocused && pathname.includes('/course/') && Date.now() - lastActivityRef.current < 2 * 60 * 1000) {
            startInterval()
        } else {
            stopInterval()
        }
    }, [isFocused, pathname])

    useEffect(() => {
        return () => {
            stopInterval()
            sendAccumulatedTime()
        }
    }, [])

    return null
}