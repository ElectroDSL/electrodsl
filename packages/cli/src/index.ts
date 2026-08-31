#!/usr/bin/env node

import {
    resolve,
    basename,
    extname
} from "node:path";

import { readFileSync, writeFileSync } from "node:fs";
import { parseFile } from "@electrodsl/parser";
import { compile } from "@electrodsl/integration";
import {
    DuplicateComponentIdRule,
    ElectricalReferenceRule,
    EngineeringSemanticsRule,
    LanguageVersionRule,
    NetDefinitionRule,
    RoutePreferenceRule,
    Validator
} from "@electrodsl/validator";
import { LibrarySymbolProvider } from "@electrodsl/library";
import { format } from "@electrodsl/formatter";
import { serializeCanonicalIR } from "@electrodsl/ir";
import { ElectroDSLSyntaxError } from "@electrodsl/parser";


const args = process.argv.slice(2);
const command = args[0];

try {

if (command === "parse") {

    const document = readDocument(args[1], "edsl parse <file.edsl>");

    console.log(JSON.stringify(document, null, 2));

}

else if (command === "validate" || command === "check") {

    const document = readDocument(args[1], `edsl ${command} <file.edsl>`);

    validate(document);

}

else if (command === "build") {

    const file = requiredFile(args[1], "edsl build <file.edsl>");
    const output = outputPath(file);
    const document = parseFile(file);

    validate(document);

    writeFileSync(
        output,
        compile(readFileSync(file, "utf8")),
        "utf-8"
    );

    console.log(`Built ${output}`);

}

else if (command === "format" || command === "fmt") {

    const file = requiredFile(args[1], "edsl format <file.edsl> [--check|--write]");
    const source = readFileSync(file, "utf8");
    const formatted = format(source);

    if (args.includes("--check")) {
        if (source.replaceAll("\r\n", "\n") !== formatted) {
            console.error(`${file} is not formatted.`);
            process.exitCode = 1;
        } else {
            console.log(`✓ ${file} is formatted`);
        }
    } else if (args.includes("--write")) {
        writeFileSync(file, formatted, "utf8");
        console.log(`Formatted ${file}`);
    } else {
        process.stdout.write(formatted);
    }

}

else if (command === "export") {

    const file = requiredFile(args[1], "edsl export <file.edsl> --format svg");
    const format = readOption(args.slice(2), "--format");

    if (format !== "svg" && format !== "json") {
        console.error("Supported export formats are svg and json.");
        process.exit(1);
    }

    const document = parseFile(file);

    validate(document);

    if (format === "json") {
        const output = outputPath(file, ".json");
        writeFileSync(output, serializeCanonicalIR(document), "utf-8");
        console.log(`Exported ${output}`);
        process.exit(0);
    }

    const output = outputPath(file);

    writeFileSync(
        output,
        compile(readFileSync(file, "utf8")),
        "utf-8"
    );

    console.log(`Exported ${output}`);

}

else {

    console.log(`
ElectroDSL CLI

Commands:

  edsl parse <file.edsl>
  edsl validate <file.edsl>
  edsl check <file.edsl>
  edsl format <file.edsl> [--check|--write]
  edsl build <file.edsl>
  edsl export <file.edsl> --format svg|json
`);

}

} catch (error) {
    if (error instanceof ElectroDSLSyntaxError) {
        for (const diagnostic of error.diagnostics) {
            const location = diagnostic.line === undefined
                ? ""
                : `${diagnostic.line}:${diagnostic.column} `;
            console.error(`${location}${diagnostic.code} ${diagnostic.message}`);
        }
        process.exitCode = 1;
    } else {
        throw error;
    }
}

function readDocument(
    file: string | undefined,
    usage: string
) {

    return parseFile(requiredFile(file, usage));

}

function requiredFile(
    file: string | undefined,
    usage: string
): string {

    if (!file) {
        console.error(`Usage: ${usage}`);
        process.exit(1);
    }

    return file;

}

function validate(
    document: ReturnType<typeof parseFile>
): void {

    const symbols = new LibrarySymbolProvider(
        resolve("packages/library/library")
    );

    const result = new Validator([
        new LanguageVersionRule(),
        new DuplicateComponentIdRule(),
        new ElectricalReferenceRule(symbols),
        new EngineeringSemanticsRule(),
        new NetDefinitionRule(),
        new RoutePreferenceRule()
    ]).validate(document);

    if (result.errors.length === 0) {
        console.log("✓ No validation errors");
        return;
    }

    for (const error of result.errors) {
        console.log(`${error.code}: ${error.message}`);
    }

    process.exit(1);

}

function outputPath(
    file: string,
    extension = ".svg"
): string {

    return resolve(file, "..", `${basename(file, extname(file))}${extension}`);

}

function readOption(
    values: string[],
    option: string
): string | undefined {

    const index = values.indexOf(option);

    return index === -1 ? undefined : values[index + 1];

}
