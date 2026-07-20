import {
    ElectroDSLLexer
} from "../lexer/lexer.js";

import {
    parser
} from "../grammar/ElectroDSLParser.js";

import {
    AstBuilderVisitor
} from "../builder/CstToAstVisitor.js";


export function parse(source:string){


    const lexResult =
        ElectroDSLLexer.tokenize(source);


  


    parser.input =
        lexResult.tokens;


    const cst =
        parser.document();





    const visitor =
        new AstBuilderVisitor();


    const result =
        visitor.visit(cst);





    return result;

}