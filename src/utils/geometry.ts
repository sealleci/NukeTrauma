/**
 * Shoelace formula. 
 * https://en.wikipedia.org/wiki/Shoelace_formula
 */
function calcPolygonArea(coords: [number, number][], isRawResult: boolean = false): number {
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

    // XXX:
    // Area value could be negative,
    // which is determined by the clock direction of the traversal.
    return isRawResult ? result / 2 : Math.abs(result / 2)
}

/**
 * Polygon centroid formula.
 * https://mathworld.wolfram.com/PolygonCentroid.html
 */
function calcPolygonCentroid(coords: [number, number][]): [number, number] {
    const area = calcPolygonArea(coords, true)
    const minX = coords.reduce((min, coord) => Math.min(min, coord[0]), Infinity)
    const minY = coords.reduce((min, coord) => Math.min(min, coord[1]), Infinity)
    let centerX: number = 0
    let centerY: number = 0

    for (let i = 0; i < coords.length; i += 1) {
        const factor = (
            (coords[i][0] - minX)
            * (coords[(i + 1) % coords.length][1] - minY)
            - (coords[(i + 1) % coords.length][0] - minX)
            * (coords[i][1] - minY)
        )

        centerX += (
            coords[i][0]
            + coords[(i + 1) % coords.length][0]
            - minX * 2
        ) * factor
        centerY += (
            coords[i][1]
            + coords[(i + 1) % coords.length][1]
            - minY * 2
        ) * factor
    }

    return [centerX / (6 * area) + minX, centerY / (6 * area) + minY]
}

export { calcPolygonArea, calcPolygonCentroid }
