import type {
    PositionedNode
} from "@electrodsl/layout";

import {
    NodeKind
} from "@electrodsl/ast";

import type {
    ComponentNode
} from "@electrodsl/ast";


export function positionedNodeToComponent(
    node: PositionedNode
): ComponentNode {


    return {

        kind: NodeKind.Component,

        id: node.id,

        componentType: node.type,

        type: node.type,

        properties: [],

        pins: [],

        position: {

            x: node.x,

            y: node.y

        }

    };

}