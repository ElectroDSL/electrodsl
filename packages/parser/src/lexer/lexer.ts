import { createToken, Lexer } from "chevrotain";
import {
    allTokens
} from "./tokens.js";


export const ElectroDSLLexer = new Lexer(
    allTokens
);