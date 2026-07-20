#!/usr/bin/env node

import { basename, extname, resolve } from "node:path";
import { writeFileSync } from "node:fs";
import { parseFile } from "@electrodsl/parser";
import { renderSVG } from "@electrodsl/renderer-svg";
import { DuplicateComponentIdRule, Validator } from "@electrodsl/validator";

const args = process.argv.slice(2);
const command = args[0];

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

    writeFileSync(output, renderSVG(parseFile(file)), "utf-8");

    console.log(`Built ${output}`);

}

else if (command === "export") {

    const file = requiredFile(args[1], "edsl export <file.edsl> --format svg");
    const format = readOption(args.slice(2), "--format");

    if (format !== "svg") {
        console.error("Only the svg export format is currently supported.");
        process.exit(1);
    }

    const output = outputPath(file);

    writeFileSync(output, renderSVG(parseFile(file)), "utf-8");

    console.log(`Exported ${output}`);

}

else {

    console.log(`
ElectroDSL CLI

Commands:

  edsl parse <file.edsl>
  edsl validate <file.edsl>
  edsl check <file.edsl>
  edsl build <file.edsl>
  edsl export <file.edsl> --format svg
`);

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

    const result = new Validator([
        new DuplicateComponentIdRule()
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
    file: string
): string {

    return resolve(file, "..", `${basename(file, extname(file))}.svg`);

}

function readOption(
    values: string[],
    option: string
): string | undefined {

    const index = values.indexOf(option);

    return index === -1 ? undefined : values[index + 1];

}

