import fs from "fs";
import path from "path";

import { ComponentDefinition } from "../ComponentDefinition.js";


export class LibraryLoader {


    load(
        file: string
    ): ComponentDefinition {


        const json =
            fs.readFileSync(
                file,
                "utf-8"
            );


        const component =
            JSON.parse(json) as ComponentDefinition;


        component.basePath =
            path.dirname(file);


        return component;

    }

}