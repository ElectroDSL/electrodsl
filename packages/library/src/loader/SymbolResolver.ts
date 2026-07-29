import path from "node:path";

import type { ComponentDefinition } from "../ComponentDefinition.js";

export class SymbolResolver {

    resolve(
        component: ComponentDefinition
    ): string {

        if (!component.basePath) {

            throw new Error(
                `Component '${component.id}' has no basePath.`
            );

        }

        return path.join(
            component.basePath,
            component.symbol.file
        );

    }

}