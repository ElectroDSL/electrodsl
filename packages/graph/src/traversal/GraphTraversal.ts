import type { ElectricalGraph, ElectricalNode } from "../model";
import { GraphQuery } from "../query";


export class GraphTraversal {


    private readonly query: GraphQuery;


    constructor(
        private readonly graph: ElectricalGraph
    ) {

        this.query = new GraphQuery(graph);

    }



    /**
     * Breadth First Search
     */
    bfs(
        startNodeId: string
    ): ElectricalNode[] {


        const visited = new Set<string>();

        const result: ElectricalNode[] = [];

        const queue: string[] = [
            startNodeId
        ];



        while (queue.length > 0) {


            const current =
                queue.shift()!;



            if (visited.has(current)) {
                continue;
            }


            visited.add(current);



            const node =
                this.graph.getNode(current);



            if (!node) {
                continue;
            }


            result.push(node);



            const neighbors =
                this.query.getNeighbors(current);



            for (const neighbor of neighbors) {


                if (!visited.has(neighbor.id)) {

                    queue.push(neighbor.id);

                }

            }

        }


        return result;

    }





    /**
     * Depth First Search
     */
    dfs(
        startNodeId: string
    ): ElectricalNode[] {


        const visited =
            new Set<string>();


        const result: ElectricalNode[] = [];



        const visit = (
            nodeId: string
        ) => {


            if (visited.has(nodeId)) {
                return;
            }


            visited.add(nodeId);



            const node =
                this.graph.getNode(nodeId);



            if (!node) {
                return;
            }



            result.push(node);



            const neighbors =
                this.query.getNeighbors(nodeId);



            for (const neighbor of neighbors) {

                visit(neighbor.id);

            }


        };



        visit(startNodeId);


        return result;

    }





    /**
     * Finds isolated electrical networks.
     */
    connectedComponents(): ElectricalNode[][] {


        const visited =
            new Set<string>();


        const components:
            ElectricalNode[][] = [];



        for (const node of this.graph.getNodes()) {


            if (visited.has(node.id)) {
                continue;
            }



            const group =
                this.bfs(node.id);



            group.forEach(n =>
                visited.add(n.id)
            );


            components.push(group);

        }



        return components;

    }


}