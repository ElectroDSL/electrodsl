import type { ElectricalGraph } from "../model";


export interface GraphValidationResult {

    valid: boolean;

    errors: string[];

}


/**
 * Validates structural correctness of an ElectricalGraph.
 */
export class GraphValidator {


    validate(graph: ElectricalGraph): GraphValidationResult {


        const errors: string[] = [];


        for (const edge of graph.getEdges()) {


            this.validateEndpoint(
                graph,
                edge.id,
                edge.sourcePortId,
                "source",
                errors
            );


            this.validateEndpoint(
                graph,
                edge.id,
                edge.targetPortId,
                "target",
                errors
            );

        }


        return {

            valid: errors.length === 0,

            errors,

        };

    }



    private validateEndpoint(
        graph: ElectricalGraph,
        edgeId: string,
        portId: string,
        endpointType: string,
        errors: string[]
    ) {


        const separatorIndex = portId.indexOf(":");


        if (separatorIndex === -1) {

            errors.push(
                `${endpointType} port '${portId}' in edge '${edgeId}' has invalid format.`
            );

            return;

        }


        const nodeId =
            portId.substring(0, separatorIndex);


        const portName =
            portId.substring(separatorIndex + 1);



        const node =
            graph.getNode(nodeId);



        if (!node) {

            errors.push(
                `${endpointType} node '${nodeId}' does not exist for edge '${edgeId}'.`
            );

            return;

        }



        const port =
            node.ports.find(
                p => p.name === portName
            );



        if (!port) {

            errors.push(
                `${endpointType} port '${portName}' does not exist on node '${nodeId}' for edge '${edgeId}'.`
            );

        }


    }

}