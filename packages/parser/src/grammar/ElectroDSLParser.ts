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
    Component,
    Colon,
    Equals,
    Connect,
    Net,
    Dot,
    Arrow,
    Semicolon,
    Identifier
} from "../lexer/tokens.js";


class ElectroDSLParser extends CstParser {


constructor(){

    super(
        allTokens,
        {
            recoveryEnabled:true
        }
    );


    this.performSelfAnalysis();

}



public document = this.RULE(
"document",
()=>{


    this.CONSUME(EDSL);

    this.CONSUME(Version);


    this.SUBRULE(
        this.project
    );


});


public project = this.RULE(
"project",
()=>{


    this.CONSUME(Project);


    this.CONSUME(StringLiteral);


    this.CONSUME(LBrace);


    this.MANY(()=>{

        this.SUBRULE(
            this.circuit
        );

    });


    this.CONSUME(RBrace);


});


public circuit = this.RULE(
"circuit",
()=>{


    this.CONSUME(Circuit);


    this.CONSUME2(StringLiteral);


    this.CONSUME(LBrace);


 this.MANY(()=>{

this.OR([

{
ALT:()=>this.SUBRULE(this.component)
},

{
ALT:()=>this.SUBRULE(this.connection)

},

{
ALT:()=>this.SUBRULE(this.net)
}

]);

});

    this.CONSUME2(RBrace);


});


public component = this.RULE(
"component",
()=>{

    this.CONSUME(Component);

    this.CONSUME(Identifier);

    this.CONSUME(Colon);

    this.CONSUME2(Identifier,{
        LABEL:"type"
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

    }
);

public connection =
this.RULE(
"connection",
()=>{


this.CONSUME(Connect);


this.CONSUME(Identifier);


this.CONSUME1(Dot);


this.CONSUME2(Identifier);


this.CONSUME(Arrow);


this.CONSUME3(Identifier);


this.CONSUME2(Dot);


this.CONSUME4(Identifier);


this.CONSUME(Semicolon);


});

public net = this.RULE(
"net",
()=>{

this.CONSUME(Net);

this.CONSUME(Identifier);

this.OPTION(()=>this.CONSUME(Semicolon));

}
);


}


export const parser =
new ElectroDSLParser();
