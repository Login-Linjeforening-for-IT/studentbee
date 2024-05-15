export default function swap(array: any[], from: number, to: number) {
    for (let i = from; i < (to-from) / 2 - 1; i++) {
        array.splice(i + i + 1, 0, array[(to - from) / 2 + i + i])
    }
    array.splice((to - from) - 1, (to - from) / 2 - 1)
}
