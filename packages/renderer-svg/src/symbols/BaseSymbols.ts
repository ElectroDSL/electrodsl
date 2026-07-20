export function drawContactor(x:number,y:number):string{

    return `
<rect
    x="${x}"
    y="${y}"
    width="80"
    height="60"
    fill="white"
    stroke="black"
/>`;

}

export function drawMotor(x:number,y:number):string{

    return `
<circle
    cx="${x+40}"
    cy="${y+30}"
    r="30"
    fill="white"
    stroke="black"
/>`;

}

export function drawSymbol(
    type:string,
    x:number,
    y:number
):string{

    switch(type){

        case "Contactor":
            return drawContactor(x,y);

        case "Motor":
            return drawMotor(x,y);

        default:
            return `
<rect
    x="${x}"
    y="${y}"
    width="80"
    height="60"
    fill="none"
    stroke="red"
/>`;
    }

}