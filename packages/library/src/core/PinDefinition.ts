export interface PinDefinition {

    id:string;

    name:string;

    number?:string;


    electricalType:
        | "power"
        | "signal"
        | "control"
        | "earth";


    direction:
        | "input"
        | "output"
        | "bidirectional";


    position:{
        x:number;
        y:number;
    };

}