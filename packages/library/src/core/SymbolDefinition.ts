export interface SymbolDefinition {

    id:string;

    file:string;

    width:number;

    height:number;

    pins:{
        name:string;
        x:number;
        y:number;
    }[];

}