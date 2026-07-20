import { AstNode } from "./AstNode.js";
import { NodeKind } from "../enums/NodeKind.js";


export interface ConnectionNode extends AstNode {


    kind: NodeKind.Connection;


    from:{
        component:string;
        pin:string;
    };


    to:{
        component:string;
        pin:string;
    };


}