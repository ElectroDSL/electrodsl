import type { ElectricalGraph } from "../model/ElectricalGraph.js";


export class GraphDepth {


    constructor(
        private readonly graph: ElectricalGraph
    ) {}



    calculate(
        startNodeId: string
    ): Map<string, number> {


        const depth =
            new Map<string, number>();


        const queue: string[] = [];


        queue.push(startNodeId);

        depth.set(
            startNodeId,
            0
        );



        while(queue.length > 0) {


            const current =
                queue.shift()!;


            const currentDepth =
                depth.get(current)!;



            const neighbours =
                this.findNeighbours(current);



            for(const neighbour of neighbours) {


                if(!depth.has(neighbour)) {


                    depth.set(
                        neighbour,
                        currentDepth + 1
                    );


                    queue.push(neighbour);

                }

            }


        }


        return depth;

    }




    private findNeighbours(
        nodeId: string
    ): string[] {


        const result: string[] = [];



        for(const edge of this.graph.getEdges()) {


            const sourceNode =
                edge.sourcePortId.split(":")[0];


            const targetNode =
                edge.targetPortId.split(":")[0];



            if(sourceNode === nodeId) {

                result.push(targetNode);

            }


            if(targetNode === nodeId) {

                result.push(sourceNode);

            }


        }



        return result;

    }

}