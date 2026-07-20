#!/usr/bin/env node

import { parseFile } from "@electrodsl/parser";

import {
    Validator,
    DuplicateComponentIdRule
} from "@electrodsl/validator";


const args = process.argv.slice(2);


if (args[0] === "parse") {

    const file = args[1];


    if (!file) {

        console.error(
            "Usage: edsl parse <file.edsl>"
        );

        process.exit(1);

    }


    const result = parseFile(file);


    console.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}



else if (args[0] === "validate") {


    const file = args[1];


    if (!file) {

        console.error(
            "Usage: edsl validate <file.edsl>"
        );

        process.exit(1);

    }


    const result = parseFile(file);


    const validator = new Validator([
        new DuplicateComponentIdRule()
    ]);


    const validation =
        validator.validate(result);


    if (validation.errors.length === 0) {

        console.log(
            "✓ No validation errors"
        );

    }

    else {

        for (const error of validation.errors) {

            console.log(
                `${error.code}: ${error.message}`
            );

        }

        process.exit(1);

    }

}



else {

    console.log(`
ElectroDSL CLI

Commands:

  edsl parse <file.edsl>

  edsl validate <file.edsl>

`);

}