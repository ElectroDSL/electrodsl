import {
    ElectroDSLLexer
} from "../lexer/lexer.js";

import {
    parser
} from "../grammar/ElectroDSLParser.js";

import {
    AstBuilderVisitor
} from "../builder/CstToAstVisitor.js";
import { ElectroDSLSyntaxError } from "../diagnostics/SyntaxDiagnostic.js";


export function parse(source:string){


    const lexResult =
        ElectroDSLLexer.tokenize(source);

    if (lexResult.errors.length > 0) {
        throw new ElectroDSLSyntaxError(lexResult.errors.map(error => ({
            code: "E1000" as const,
            message: error.message,
            line: error.line,
            column: error.column,
            offset: error.offset,
            length: error.length
        })));
    }


  


    parser.input =
        lexResult.tokens;


    const cst =
        parser.document();

    if (parser.errors.length > 0) {
        throw new ElectroDSLSyntaxError(parser.errors.map(error => ({
            code: "E1001" as const,
            message: error.message,
            line: error.token.startLine,
            column: error.token.startColumn,
            offset: error.token.startOffset,
            length: error.token.image.length
        })));
    }





    const visitor =
        new AstBuilderVisitor();


    const result =
        visitor.visit(cst);





    return result;

}
