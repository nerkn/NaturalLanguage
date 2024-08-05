export function randomizeElems(arr: any[]) {
    return arr.map(a => a).sort(() => Math.random() - .5)
}