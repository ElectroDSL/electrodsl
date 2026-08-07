import {
    describe,
    expect,
    it
}
from "vitest";


import {
    renderSvg
}
from "../src";


describe("SVG Renderer",()=>{


    it("renders positioned nodes",()=>{


        const layout:any = {

            nodes:[

                {
                    id:"M1",
                    type:"motor",
                    x:100,
                    y:50,
                    width:80,
                    height:40,
                    layer:0
                }

            ]

        };


        const svg =
            renderSvg(layout);



        expect(svg.elements)
            .toHaveLength(1);



        expect(svg.elements[0])
            .toContain("motor");


    });


});