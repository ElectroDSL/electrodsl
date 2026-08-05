import type { ComponentDefinition } from "../ComponentDefinition.js";

/**
 * Provides component definitions.
 */
export interface ComponentProvider {

    /**
     * Returns a component definition by type.
     */
    getComponent(
        type: string
    ): ComponentDefinition | undefined;

    /**
     * Returns true if the component exists.
     */
    hasComponent(
        type: string
    ): boolean;

    /**
     * Lists every available component type.
     */
    listComponents(): string[];

}