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

        const document =
            this.visit(ctx.project[0]);

        document.version =
            ctx.Version[0].image;

        return document;

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
                    ) ?? [],

                modules:
                    ctx.module?.map(
                        (m: any) => this.visit(m)
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
                ) ?? [],

            junctions:
                ctx.junction?.map(
                    (j: any) => this.visit(j)
                ) ?? [],

            ports: ctx.port?.map((n: any) => this.visit(n)) ?? [],
            conductors: ctx.conductor?.map((n: any) => this.visit(n)) ?? [],
            cables: ctx.cable?.map((n: any) => this.visit(n)) ?? [],
            buses: ctx.bus?.map((n: any) => this.visit(n)) ?? [],
            instances: ctx.instance?.map((n: any) => this.visit(n)) ?? []

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
                ctx.property
                    ?.map(
                        (p: any) => this.visit(p)
                    )
                    .filter(Boolean)
                ?? [],

            pins:[]

        };

    }

    property(ctx: any) {

        if (
            !ctx.Identifier ||
            !ctx.StringLiteral
        ) {
            return null;
        }


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

        const route = ctx.routeValue?.[0]
            ?.image
            .replaceAll('"', "");

        return {

            kind: NodeKind.Connection,

            from: this.visit(ctx.from[0]),

            to: this.visit(ctx.to[0]),

            route

        };

    }

    net(ctx: any) {

        return {

            kind: NodeKind.Net,

            name: ctx.netName[0].image,

            members:
                ctx.member?.map(
                    (member: any) => this.visit(member)
                ) ?? []

        };

    }

    junction(ctx: any) {

        return {
            kind: NodeKind.Junction,
            id: ctx.Identifier[0].image
        };

    }

    endpoint(ctx: any) {

        return {
            component: ctx.component[0].image,
            pin: ctx.pin?.[0]?.image ?? ""
        };

    }

    propertyBlock(ctx: any) {
        return ctx.property?.map((p: any) => this.visit(p)).filter(Boolean) ?? [];
    }

    port(ctx: any) {
        return { kind: NodeKind.Port, id: ctx.Identifier[0].image };
    }

    instance(ctx: any) {
        return {
            kind: NodeKind.Instance,
            id: ctx.instanceId[0].image,
            module: ctx.moduleName[0].image
        };
    }

    cable(ctx: any) {
        return {
            kind: NodeKind.Cable,
            id: ctx.Identifier[0].image,
            properties: this.visit(ctx.propertyBlock[0])
        };
    }

    conductor(ctx: any) {
        return {
            kind: NodeKind.Conductor,
            id: ctx.Identifier[0].image,
            from: this.visit(ctx.from[0]),
            to: this.visit(ctx.to[0]),
            properties: this.visit(ctx.propertyBlock[0])
        };
    }

    bus(ctx: any) {
        return {
            kind: NodeKind.Bus,
            name: ctx.busName[0].image,
            properties: ctx.busProperty?.map((p: any) => this.visit(p)).filter(Boolean) ?? [],
            members: ctx.member?.map((m: any) => this.visit(m)) ?? []
        };
    }

    module(ctx: any) {
        const body = {
            kind: NodeKind.Circuit,
            name: ctx.moduleName[0].image,
            components: ctx.component?.map((n: any) => this.visit(n)) ?? [],
            connections: ctx.connection?.map((n: any) => this.visit(n)) ?? [],
            nets: ctx.net?.map((n: any) => this.visit(n)) ?? [],
            junctions: ctx.junction?.map((n: any) => this.visit(n)) ?? [],
            ports: ctx.port?.map((n: any) => this.visit(n)) ?? [],
            conductors: ctx.conductor?.map((n: any) => this.visit(n)) ?? [],
            cables: ctx.cable?.map((n: any) => this.visit(n)) ?? [],
            buses: ctx.bus?.map((n: any) => this.visit(n)) ?? [],
            instances: ctx.instance?.map((n: any) => this.visit(n)) ?? []
        };
        return {
            kind: NodeKind.Module,
            name: ctx.moduleName[0].image,
            ports: body.ports,
            circuit: body
        };
    }

}
