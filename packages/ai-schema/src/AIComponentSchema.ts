import {DesignIntent} from "./DesignIntent";
import {ComponentIntent} from "./ComponentIntent";


export interface AISchematic {

    design:DesignIntent;

    components:
        ComponentIntent[];

    connections:{
        from:string;
        to:string;
    }[];

}