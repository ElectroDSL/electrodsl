import type { ElectricalNode } from "@electrodsl/graph";


export interface LayoutResult {

    node: ElectricalNode;

    x: number;

    y: number;

    layer: number;

}