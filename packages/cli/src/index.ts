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
import { ElectroDSLLanguageService } from "@electrodsl/language-service";
import { startLanguageServer } from "@electrodsl/language-server";
import { createDefaultAdapterRegistry } from "@electrodsl/adapters";
import { buildGenerationPrompt, explainDesign, reviewDesign } from "@electrodsl/ai-tools";
import { buildProject, checkProject, ProjectValidationError, verifyProjectBuild } from "@electrodsl/project";
import { generateProductionReport, reportCsvFiles } from "@electrodsl/reports";
import { mkdirSync } from "node:fs";


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

else if (command === "diagnose") {

    const file = requiredFile(args[1], "edsl diagnose <file.edsl> [--json]");
    const service = new ElectroDSLLanguageService(new LibrarySymbolProvider(resolve("packages/library/library")));
    const diagnostics = service.diagnose(readFileSync(file, "utf8"));
    if (args.includes("--json")) console.log(JSON.stringify(diagnostics, null, 2));
    else if (diagnostics.length === 0) console.log("✓ No diagnostics");
    else for (const diagnostic of diagnostics) console.log(`${diagnostic.code}: ${diagnostic.message}`);
    if (diagnostics.some(diagnostic => diagnostic.severity === "error")) process.exitCode = 1;

}

else if (command === "lsp") {

    startLanguageServer();

}

else if (command === "explain") {

    const file = requiredFile(args[1], "edsl explain <file.edsl>");
    console.log(JSON.stringify(explainDesign(readFileSync(file, "utf8")), null, 2));

}

else if (command === "review") {

    const file = requiredFile(args[1], "edsl review <file.edsl>");
    const symbols = new LibrarySymbolProvider(resolve("packages/library/library"));
    const review = reviewDesign(readFileSync(file, "utf8"), symbols);
    console.log(JSON.stringify(review, null, 2));
    if (!review.valid) process.exitCode = 1;

}

else if (command === "ai-prompt") {

    const requirement = args.slice(1).join(" ").trim();
    if (!requirement) requiredFile(undefined, 'edsl ai-prompt "<requirement>"');
    const symbols = new LibrarySymbolProvider(resolve("packages/library/library"));
    console.log(buildGenerationPrompt(requirement, symbols.listSymbols()));

}

else if (command === "import") {

    const file = requiredFile(args[1], "edsl import <file> --format netlist-csv [--output file.edsl]");
    const format = readOption(args.slice(2), "--format");
    const adapter = format ? createDefaultAdapterRegistry().get(format) : undefined;
    if (!adapter?.import) {
        console.error(`Import adapter '${format ?? ""}' is unavailable.`);
        process.exit(1);
    }
    const imported = adapter.import(readFileSync(file, "utf8"));
    const output = readOption(args.slice(2), "--output");
    if (output) {
        writeFileSync(output, imported, "utf8");
        console.log(`Imported ${output}`);
    } else process.stdout.write(imported);

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

else if (command === "project" && args[1] === "build") {

    const directory = requiredFile(args[2], "edsl project build <directory>");
    const manifest = buildProject(directory);
    console.log(`Built ${manifest.artifacts.length} verified artifacts for ${manifest.project.name}`);

}

else if (command === "project" && args[1] === "check") {

    const directory = requiredFile(args[2], "edsl project check <directory> [--json]");
    const result = checkProject(directory);
    if (args.includes("--json")) console.log(JSON.stringify(result, null, 2));
    else if (result.valid) console.log(`✓ ${result.project} passed the project quality gate`);
    else for (const diagnostic of result.errors) console.error(`${diagnostic.code}: ${diagnostic.message}${diagnostic.source ? ` (${diagnostic.source})` : ""}`);
    if (!result.valid) process.exitCode = 1;

}

else if (command === "project" && args[1] === "verify") {

    const directory = requiredFile(args[2], "edsl project verify <directory>");
    const result = verifyProjectBuild(directory);
    if (result.valid) console.log("✓ Project artifacts are current and verified");
    else {
        for (const error of result.errors) console.error(`${error.code}: ${error.message}${error.path ? ` (${error.path})` : ""}`);
        process.exitCode = 1;
    }

}

else if (command === "report") {

    const file = requiredFile(args[1], "edsl report <file.edsl> [--output directory]");
    const report = generateProductionReport(parseFile(file));
    const directory = readOption(args.slice(2), "--output");
    if (!directory) console.log(JSON.stringify(report, null, 2));
    else {
        mkdirSync(directory, { recursive: true });
        writeFileSync(resolve(directory, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
        for (const [name, content] of Object.entries(reportCsvFiles(report))) writeFileSync(resolve(directory, name), content, "utf8");
        console.log(`Wrote production reports to ${resolve(directory)}`);
    }

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

    const file = requiredFile(args[1], "edsl export <file.edsl> --format svg|json|netlist-csv");
    const format = readOption(args.slice(2), "--format");

    if (format !== "svg" && format !== "json" && format !== "netlist-csv") {
        console.error("Supported export formats are svg, json, and netlist-csv.");
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

    if (format === "netlist-csv") {
        const output = outputPath(file, ".csv");
        const adapter = createDefaultAdapterRegistry().get("netlist-csv")!;
        writeFileSync(output, adapter.export(document), "utf-8");
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
  edsl diagnose <file.edsl> [--json]
  edsl lsp --stdio
  edsl explain <file.edsl>
  edsl review <file.edsl>
  edsl ai-prompt "<requirement>"
  edsl import <file> --format netlist-csv [--output file.edsl]
  edsl format <file.edsl> [--check|--write]
  edsl build <file.edsl>
  edsl project build <directory>
  edsl project check <directory> [--json]
  edsl project verify <directory>
  edsl report <file.edsl> [--output directory]
  edsl export <file.edsl> --format svg|json|netlist-csv
`);

}

} catch (error) {
    if (error instanceof ProjectValidationError) {
        for (const diagnostic of error.result.errors) console.error(`${diagnostic.code}: ${diagnostic.message}${diagnostic.source ? ` (${diagnostic.source})` : ""}`);
        process.exitCode = 1;
    } else if (error instanceof ElectroDSLSyntaxError) {
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
