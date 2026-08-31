import { describe, it, expect } from "vitest";

import {
    loadComponentLibrary
}
from "../src/loadComponentLibrary.js";


describe(
    "ComponentLibrary",
    () => {


        it(
            "loads reusable JSON component definitions",
            () => {


                const library =
                    loadComponentLibrary(
                        "packages/library/library"
                    );


                const motor =
                    library.get(
                        "Motor"
                    );


                expect(
                    motor
                ).toBeDefined();


                expect(
                    motor?.name
                )
                .toBe(
                    "Motor"
                );


                expect(
                    motor?.terminals.length
                )
                .toBe(
                    4
                );


                expect(
                    motor?.symbol.file
                )
                .toBe(
                    "motor.svg"
                );


            }
        );


    }
);