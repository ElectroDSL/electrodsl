import { Lexer } from "chevrotain";
import { createToken } from "chevrotain";


export const Project = createToken({
    name: "Project",
    pattern: /PROJECT/
});


export const StringLiteral = createToken({
    name: "StringLiteral",
    pattern: /"[^"]*"/
});


export const LBrace = createToken({
    name: "LBrace",
    pattern: /\{/
});


export const RBrace = createToken({
    name: "RBrace",
    pattern: /\}/
});


export const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: "SKIPPED"
});


export const Circuit = createToken({
    name: "Circuit",
    pattern: /CIRCUIT/
});


export const Identifier = createToken({
    name: "Identifier",
    pattern: /[A-Za-z_][A-Za-z0-9_]*/
});

export const EDSL =
createToken({
name:"EDSL",
pattern:/EDSL/
});


export const Version =
createToken({
name:"Version",
pattern:/\d+\.\d+/
});


export const Component = createToken({
    name:"Component",
    pattern:/COMPONENT/
});


export const Colon = createToken({
    name:"Colon",
    pattern:/:/
});

export const Dot = createToken({
    name:"Dot",
    pattern:/\./
});


export const Arrow = createToken({
    name:"Arrow",
    pattern:/->/
});


export const Semicolon = createToken({
    name:"Semicolon",
    pattern:/;/
});


export const Equals = createToken({
    name:"Equals",
    pattern:/=/
});

export const Connect = createToken({

name:"Connect",

pattern:/CONNECT/

});

export const Net = createToken({

name:"Net",

pattern:/NET/

});

export const allTokens = [

    WhiteSpace,

    EDSL,
    Version,

    Project,
    Circuit,
    Component,
    Net,

    StringLiteral,
    Connect,
    Identifier,

    Colon,
    Equals,

    Arrow,
    Dot,
    Semicolon,
    
    LBrace,
    RBrace

];
