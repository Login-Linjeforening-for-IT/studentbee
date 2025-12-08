export function humanizeTime(time: number): string {
    const days = Math.floor(time / 86400)
    const hours = Math.floor((time % 86400) / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)

    if (days > 0) {
        return `${days}d ${hours}h`
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`
    } else {
        return `${minutes}m ${seconds}s`
    }
}
