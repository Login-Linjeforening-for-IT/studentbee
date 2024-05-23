export default function getCookie(name: string): object | string | undefined {
    const item = localStorage.getItem(name)

    if (!item) {
        return undefined
    }

    try {
        const parsedOnce = JSON.parse(item)
        try {
            const parsedTwice = JSON.parse(parsedOnce)
            return parsedTwice
        } catch (error) {
            return parsedOnce
        }
    } catch (error: unknown) {
        const err = error as Error
        return err.message
    }
}

export function setCookie(name: string, value: string) {
    localStorage.setItem(name, JSON.stringify(value))
}

export function removeCookie(name: string): void {
    localStorage.removeItem(name)
}