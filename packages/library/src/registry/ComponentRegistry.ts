import type { ComponentDefinition } from "../ComponentDefinition.js";
import type { ComponentProvider } from "../providers/ComponentProvider.js";

export class ComponentRegistry implements ComponentProvider {

    private readonly components =
        new Map<string, ComponentDefinition>();


    /**
     * Registers a component definition.
     */
    register(
        component: ComponentDefinition
    ): void {

        if (this.components.has(component.id)) {

            throw new Error(
                `Duplicate component id: ${component.id}`
            );

        }

        this.components.set(
            component.id,
            component
        );

    }


    /**
 * Returns a component definition.
 */
get(
    id: string
): ComponentDefinition | undefined {

    return this.components.get(id);

}


/**
 * ComponentProvider compatibility.
 */
getComponent(
    type: string
): ComponentDefinition | undefined {

    return this.get(type);

}


/**
 * Returns true if component exists.
 */
has(
    id: string
): boolean {

    return this.components.has(id);

}


/**
 * ComponentProvider compatibility.
 */
hasComponent(
    type: string
): boolean {

    return this.has(type);

}


/**
 * Returns all component ids.
 */
list(): string[] {

    return [
        ...this.components.keys()
    ];

}


/**
 * ComponentProvider compatibility.
 */
listComponents(): string[] {

    return this.list();

}}