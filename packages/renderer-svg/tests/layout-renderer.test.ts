import {
    describe,
    expect,
    it
} from "vitest";


import {
    renderPlacedLayoutSVG
} from "../src";


import type {
    PlacedLayout
} from "@electrodsl/layout";



describe(
    "Layout SVG Renderer",
    () => {


        it(
            "renders placed components",
            () => {


                const layout =
                {

                    graph:
                    {} as any,


                    nodes:
                    [

                        {
                            id:"Q1",
                            type:"breaker",
                            x:0,
                            y:0,
                            width:80,
                            height:40,
                            layer:0
                        },


                        {
                            id:"K1",
                            type:"contactor",
                            x:250,
                            y:0,
                            width:80,
                            height:40,
                            layer:1
                        }

                    ]

                } satisfies PlacedLayout;



                const svg =
                    renderPlacedLayoutSVG(
                        layout
                    );



                expect(svg)
                    .toContain(
                        "Q1"
                    );


                expect(svg)
                    .toContain(
                        "K1"
                    );


                expect(svg)
                    .toContain(
                        "250"
                    );


            }
        );


    }
);