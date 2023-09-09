function shuffle<T>(array: T[]): T[] {
    const newArray = Array.from(array)
    for (let i = newArray.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    } return newArray;
}

function getRangeRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export { shuffle, getRangeRandom }
