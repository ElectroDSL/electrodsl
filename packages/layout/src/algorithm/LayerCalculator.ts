import type { ElectricalGraph } from "@electrodsl/graph";
import { GraphDepth } from "@electrodsl/graph";


export class LayerCalculator {


    constructor(
        private readonly graph: ElectricalGraph
    ) {}



    calculate(
        startNodeId: string
    ): Map<string, number> {


        const depth =
            new GraphDepth(this.graph);



        return depth.calculate(startNodeId);

    }

}