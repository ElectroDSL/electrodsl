import {
    CstParser
} from "chevrotain";


import {
    allTokens,
    Project,
    Circuit,
    StringLiteral,
    LBrace,
    RBrace,
    EDSL,
    Version,
    NumericIdentifier,
    Component,
    Colon,
    Equals,
    Connect,
    Net,
    Junction,
    Route,
    Dot,
    Arrow,
    Semicolon,
    Identifier,
    Module,
    Instance,
    Port,
    Conductor,
    Cable,
    Bus
} from "../lexer/tokens.js";


class ElectroDSLParser extends CstParser {


    constructor() {

        super(
            allTokens,
            {
                recoveryEnabled: true
            }
        );


        this.performSelfAnalysis();

    }



    public document = this.RULE(
        "document",
        () => {


            this.CONSUME(EDSL);

            this.CONSUME(Version);


            this.SUBRULE(
                this.project
            );


        });


    public project = this.RULE(
        "project",
        () => {


            this.CONSUME(Project);


            this.CONSUME(StringLiteral);


            this.CONSUME(LBrace);


            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.circuit) },
                    { ALT: () => this.SUBRULE(this.module) }
                ]);

            });


            this.CONSUME(RBrace);


        });


    public circuit = this.RULE(
        "circuit",
        () => {


            this.CONSUME(Circuit);


            this.CONSUME2(StringLiteral);


            this.CONSUME(LBrace);


            this.MANY(() => {

                this.OR([

                    {
                        ALT: () => this.SUBRULE(this.component)
                    },

                    {
                        ALT: () => this.SUBRULE(this.connection)

                    },

                    {
                        ALT: () => this.SUBRULE(this.net)
                    },

                    {
                        ALT: () => this.SUBRULE(this.junction)
                    },
                    { ALT: () => this.SUBRULE(this.port) },
                    { ALT: () => this.SUBRULE(this.conductor) },
                    { ALT: () => this.SUBRULE(this.cable) },
                    { ALT: () => this.SUBRULE(this.bus) },
                    { ALT: () => this.SUBRULE(this.instance) }

                ]);

            });

            this.CONSUME2(RBrace);


        });


    public component = this.RULE(
        "component",
        () => {

            this.CONSUME(Component);

            this.CONSUME(Identifier);

            this.CONSUME(Colon);

            this.CONSUME2(Identifier, {
                LABEL: "type"
            });

            this.CONSUME(LBrace);


            this.MANY(() => {

                this.SUBRULE(this.property);

            });


            this.CONSUME(RBrace);

        });

    public property = this.RULE(
        "property",
        () => {

            this.CONSUME(Identifier);

            this.CONSUME(Equals);

            this.CONSUME(StringLiteral);

            this.OPTION(() => this.CONSUME(Semicolon));

        }
    );

    public connection =
        this.RULE(
            "connection",
            () => {


                this.CONSUME(Connect);

                this.SUBRULE(this.endpoint, {
                    LABEL: "from"
                });


                this.CONSUME(Arrow);


                this.SUBRULE2(this.endpoint, {
                    LABEL: "to"
                });

                this.OR([
                    {
                        ALT: () => this.CONSUME(Semicolon)
                    },
                    {
                        ALT: () => {
                            this.CONSUME(LBrace);
                            this.CONSUME(Route);
                            this.CONSUME(Equals);
                            this.CONSUME(StringLiteral, {
                                LABEL: "routeValue"
                            });
                            this.OPTION(() => this.CONSUME2(Semicolon));
                            this.CONSUME(RBrace);
                        }
                    }
                ]);


            });

    public net = this.RULE(
        "net",
        () => {

            this.CONSUME(Net);

            this.CONSUME(Identifier, {
                LABEL: "netName"
            });

            this.OPTION(() => {
                this.OR([
                    {
                        ALT: () => this.CONSUME(Semicolon)
                    },
                    {
                        ALT: () => {
                            this.CONSUME(LBrace);
                            this.MANY(() => {
                                this.SUBRULE(this.endpoint, {
                                    LABEL: "member"
                                });
                                this.OPTION2(() => this.CONSUME2(Semicolon));
                            });
                            this.CONSUME(RBrace);
                        }
                    }
                ]);
            });

        }
    );

    public junction = this.RULE(
        "junction",
        () => {
            this.CONSUME(Junction);
            this.CONSUME(Identifier);
            this.CONSUME(Semicolon);
        }
    );

    public endpoint = this.RULE(
        "endpoint",
        () => {
            this.CONSUME(Identifier, {
                LABEL: "component"
            });
            this.OPTION(() => {
                this.CONSUME(Dot);
                this.OR([
                    {
                        ALT: () => this.CONSUME2(Identifier, {
                            LABEL: "pin"
                        })
                    },
                    {
                        ALT: () => this.CONSUME(NumericIdentifier, {
                            LABEL: "pin"
                        })
                    }
                ]);
            });
        }
    );

    public propertyBlock = this.RULE("propertyBlock", () => {
        this.CONSUME(LBrace);
        this.MANY(() => this.SUBRULE(this.property));
        this.CONSUME(RBrace);
    });

    public port = this.RULE("port", () => {
        this.CONSUME(Port);
        this.CONSUME(Identifier);
        this.CONSUME(Semicolon);
    });

    public instance = this.RULE("instance", () => {
        this.CONSUME(Instance);
        this.CONSUME(Identifier, { LABEL: "instanceId" });
        this.CONSUME(Colon);
        this.CONSUME2(Identifier, { LABEL: "moduleName" });
        this.CONSUME(Semicolon);
    });

    public cable = this.RULE("cable", () => {
        this.CONSUME(Cable);
        this.CONSUME(Identifier);
        this.SUBRULE(this.propertyBlock);
    });

    public conductor = this.RULE("conductor", () => {
        this.CONSUME(Conductor);
        this.CONSUME(Identifier);
        this.CONSUME(Colon);
        this.SUBRULE(this.endpoint, { LABEL: "from" });
        this.CONSUME(Arrow);
        this.SUBRULE2(this.endpoint, { LABEL: "to" });
        this.SUBRULE(this.propertyBlock);
    });

    public bus = this.RULE("bus", () => {
        this.CONSUME(Bus);
        this.CONSUME(Identifier, { LABEL: "busName" });
        this.CONSUME(LBrace);
        this.MANY(() => this.OR([
            { ALT: () => this.SUBRULE(this.property, { LABEL: "busProperty" }) },
            { ALT: () => {
                this.SUBRULE(this.endpoint, { LABEL: "member" });
                this.CONSUME(Semicolon);
            }}
        ]));
        this.CONSUME(RBrace);
    });

    public module = this.RULE("module", () => {
        this.CONSUME(Module);
        this.CONSUME(Identifier, { LABEL: "moduleName" });
        this.CONSUME(LBrace);
        this.MANY(() => this.OR([
            { ALT: () => this.SUBRULE(this.port) },
            { ALT: () => this.SUBRULE(this.component) },
            { ALT: () => this.SUBRULE(this.connection) },
            { ALT: () => this.SUBRULE(this.net) },
            { ALT: () => this.SUBRULE(this.junction) },
            { ALT: () => this.SUBRULE(this.conductor) },
            { ALT: () => this.SUBRULE(this.cable) },
            { ALT: () => this.SUBRULE(this.bus) },
            { ALT: () => this.SUBRULE(this.instance) }
        ]));
        this.CONSUME(RBrace);
    });


}


export const parser =
    new ElectroDSLParser();
