export function drawSymbol(
    type: string,
    x: number,
    y: number
): string {

    switch (type) {

        case "Contactor":
            return drawContactor(x, y);

        case "Motor":
            return drawMotor(x, y);

        case "Fuse":
            return drawFuse(x, y);

        default:
            return drawUnknown(type, x, y);

    }

}