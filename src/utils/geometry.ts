function calcPolygonArea(coords: [number, number][]): number {
    let result: number = 0
    const minY: number = coords.reduce((min, coord) => Math.min(min, coord[1]), Infinity)

    for (let i = 0; i < coords.length; i += 1) {
        result += (
            coords[i][0]
            - coords[(i + 1) % coords.length][0]
        ) * (
                coords[(i + 1) % coords.length][1]
                + coords[i][1] - minY * 2
            )
    }

    return result / 2
}

function calcPolygonCentroid(coords: [number, number][]): [number, number] {
    const area = calcPolygonArea(coords)
    const minX = coords.reduce((min, coord) => Math.min(min, coord[0]), Infinity)
    const minY = coords.reduce((min, coord) => Math.min(min, coord[1]), Infinity)
    let x: number = 0
    let y: number = 0

    for (let i = 0; i < coords.length; i += 1) {
        const factor = (
            (coords[i][0] - minX)
            * (coords[(i + 1) % coords.length][1] - minY)
            - (coords[(i + 1) % coords.length][0] - minX)
            * (coords[i][1] - minY)
        )

        x += (
            coords[i][0]
            + coords[(i + 1) % coords.length][0]
            - minX * 2
        ) * factor
        y += (
            coords[i][1]
            + coords[(i + 1) % coords.length][1]
            - minY * 2
        ) * factor
    }

    return [x / (6 * area) + minX, y / (6 * area) + minY]
}

export { calcPolygonArea, calcPolygonCentroid }
