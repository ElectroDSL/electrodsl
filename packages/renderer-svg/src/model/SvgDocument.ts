export interface SvgDocument {


    width:number;


    height:number;


    elements:string[];


    symbols:Map<string,string>;



    addSymbol(
        id:string,
        content:string
    ):void;


}