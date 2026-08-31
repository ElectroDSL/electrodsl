import { describe, it, expect } from "vitest";

import {
    LibraryScanner,
    ComponentRegistry
}
from "../src/index.js";


describe(
    "IEC File Library",
    () => {


        it(
            "loads motor SVG symbol",
            () => {


                const registry =
                    new ComponentRegistry();



                const scanner =
                    new LibraryScanner(
                        "library"
                    );



                scanner.scan(
                    registry
                );



                const motor =
                    registry.get(
                        "IEC-MOTOR-3PH"
                    );



                expect(
                    motor
                )
                .toBeDefined();



                expect(
                    motor?.symbol.file
                )
                .toBe(
                    "symbol.svg"
                );


            }
        );


    }
);