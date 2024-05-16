export default function getCookie(name: string): string | undefined {
    const item = localStorage.getItem(name)

    if (!item) {
        return undefined
    }

    return JSON.parse(item)
}

export function setCookie(name: string, value: string) {
    localStorage.setItem(name, JSON.stringify(value))
}

export function removeCookie(name: string): void {
    localStorage.removeItem(name)
}