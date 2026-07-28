import {
    ComponentRegistry
}
    from "../registry/ComponentRegistry.js";


import {
    ComponentNode,
    PinNode,
    NodeKind
}
    from "@electrodsl/ast";



export class ComponentEnricher {


    constructor(
        private registry: ComponentRegistry
    ) { }



    enrich(
        component: ComponentNode
    ): ComponentNode {


        const definition =
            this.registry.get(
                component.type
            );



        if (!definition) {

            throw new Error(
                `Unknown component type: ${component.type}`
            );

        }



        component.pins =
            definition.terminals.map(
                terminal => ({

                    kind:
                        NodeKind.Pin,


                    name:
                        terminal.id,


                    direction:
                        terminal.direction,


                    position:
                    {
                        x:
                            terminal.position.x,


                        y:
                            terminal.position.y
                    }

                } as PinNode)
            );


        return component;

    }


}