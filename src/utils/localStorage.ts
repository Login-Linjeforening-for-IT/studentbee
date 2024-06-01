export default function getItem(name: string): object | string | undefined {
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

export function setItem(name: string, value: string) {
    localStorage.setItem(name, value)
}

export function removeItem(name: string): void {
    localStorage.removeItem(name)
}