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

    if (lexResult.errors.length > 0) {
        throw new SyntaxError(
            lexResult.errors
                .map(error => `Line ${error.line}, column ${error.column}: ${error.message}`)
                .join("\n")
        );
    }


  


    parser.input =
        lexResult.tokens;


    const cst =
        parser.document();

    if (parser.errors.length > 0) {
        throw new SyntaxError(
            parser.errors
                .map(error => error.message)
                .join("\n")
        );
    }





    const visitor =
        new AstBuilderVisitor();


    const result =
        visitor.visit(cst);





    return result;

}
