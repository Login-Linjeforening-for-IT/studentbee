export default function getItem(name: string): object | string | undefined {
    if (typeof window === "undefined" || !window.localStorage) {
        return undefined
    }

    if (name === 'user') {
        const token = localStorage.getItem('token')
        if (!token || token === "null") {
            return undefined
        }

        return {
            id: localStorage.getItem('id'),
            name: localStorage.getItem('name'),
            groups: localStorage.getItem('groups'),
            username: localStorage.getItem('email'),
            token: localStorage.getItem('token'),
            time: localStorage.getItem('time'),
            score: localStorage.getItem('score'),
            solved: localStorage.getItem('solved')
        }
    }

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
    if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(name, value)
    }
}

export function removeItem(name: string): void {
    localStorage.removeItem(name)
}