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
     * Returns true if a component exists.
     */
    has(
        id: string
    ): boolean {

        return this.components.has(id);

    }


    /**
     * Returns every registered component.
     */
    getAll(): ComponentDefinition[] {

        return [
            ...this.components.values()
        ];

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
     * Number of registered components.
     */
    size(): number {

        return this.components.size;

    }

}