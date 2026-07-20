import {
    createCstNodeVisitor
} from "chevrotain";


import {
    parser
} from "../grammar/ElectroDSLParser.js";


import {
    NodeKind
} from "@electrodsl/ast";


const BaseVisitor =
    parser.getBaseCstVisitorConstructor();



export class AstBuilderVisitor
    extends BaseVisitor {


    constructor() {

        super();

        this.validateVisitor();

    }

    document(ctx: any) {




        return this.visit(ctx.project[0]);

    }

    project(ctx: any) {



        const name =
            ctx.StringLiteral[0]
                .image
                .replaceAll('"', "");


        return {

            kind: NodeKind.Document,

            version: "0.1",

            project: {

                kind: NodeKind.Project,

                name,

                circuits:
                    ctx.circuit?.map(
                        (c: any) => this.visit(c)
                    ) ?? []

            }

        };


    }



    circuit(ctx: any) {

        return {

            kind: NodeKind.Circuit,

            name:
                ctx.StringLiteral[0]
                    .image
                    .replaceAll('"', ""),

            components:
                ctx.component?.map(
                    (c: any) => this.visit(c)
                ) ?? [],

            connections:
                ctx.connection?.map(
                    (c: any) => this.visit(c)
                ) ?? [],

            nets:
                ctx.net?.map(
                    (n: any) => this.visit(n)
                ) ?? []

        };

    }

    component(ctx: any) {

        return {

            kind: NodeKind.Component,

            id:
                ctx.Identifier[0].image,

            componentType:
                ctx.type[0].image,

            type:
                ctx.type[0].image,

            properties:
                ctx.property?.map(
                    (p: any) => this.visit(p)
                ) ?? [],

            pins: [
                {
                    name: "L1",
                    side: "left"
                },
                {
                    name: "A1",
                    side: "right"
                }
            ]

        };

    }

    property(ctx: any) {

        return {

            kind: NodeKind.Property,

            name:
                ctx.Identifier[0].image,

            value:
                ctx.StringLiteral[0]
                    .image
                    .replaceAll('"', "")
        };

    }

    connection(ctx: any) {

        return {

            kind: NodeKind.Connection,

            from: {

                component:
                    ctx.Identifier[0].image,

                pin:
                    ctx.Identifier[1].image

            },

            to: {

                component:
                    ctx.Identifier[2].image,

                pin:
                    ctx.Identifier[3].image

            }

        };

    }

    net(ctx: any) {

        return {

            kind: NodeKind.Net,

            name: ctx.Identifier[0].image

        };

    }

}
