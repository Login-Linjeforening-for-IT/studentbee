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
        return item
    }
}

export function setItem(name: string, value: string) {
    console.log('set cookie', name, value)
    localStorage.setItem(name, value)
}

export function removeItem(name: string): void {
    localStorage.removeItem(name)
}