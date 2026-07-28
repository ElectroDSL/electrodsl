import type {
    ElectricalEdge,
    ElectricalGraph,
    ElectricalNode
} from "../model";


/**
 * Provides read-only helper operations
 * over an ElectricalGraph.
 */
export class GraphQuery {


    constructor(
        private readonly graph: ElectricalGraph
    ) {}



    /**
     * Returns edges leaving a node.
     */
    getOutgoingEdges(
        nodeId: string
    ): readonly ElectricalEdge[] {


        return this.graph
            .getEdges()
            .filter(edge =>
                edge.sourcePortId.startsWith(
                    `${nodeId}:`
                )
            );

    }



    /**
     * Returns edges entering a node.
     */
    getIncomingEdges(
        nodeId: string
    ): readonly ElectricalEdge[] {


        return this.graph
            .getEdges()
            .filter(edge =>
                edge.targetPortId.startsWith(
                    `${nodeId}:`
                )
            );

    }



    /**
     * Returns directly connected nodes.
     */
    getNeighbors(
        nodeId: string
    ): readonly ElectricalNode[] {


        const neighborIds = new Set<string>();


        for (const edge of this.graph.getEdges()) {


            if (
                edge.sourcePortId.startsWith(
                    `${nodeId}:`
                )
            ) {

                neighborIds.add(
                    edge.targetPortId.split(":")[0]
                );

            }


            if (
                edge.targetPortId.startsWith(
                    `${nodeId}:`
                )
            ) {

                neighborIds.add(
                    edge.sourcePortId.split(":")[0]
                );

            }

        }



        return [
            ...neighborIds
        ]
        .map(id =>
            this.graph.getNode(id)
        )
        .filter(
            (node): node is ElectricalNode =>
                node !== undefined
        );

    }



    /**
     * Finds a port owner by port ID.
     *
     * Example:
     * Q1:L1 -> Q1
     */
    findNodeByPort(
        portId: string
    ): ElectricalNode | undefined {


        const nodeId =
            portId.split(":")[0];


        return this.graph.getNode(nodeId);

    }


}