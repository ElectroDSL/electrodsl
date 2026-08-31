import type { Component } from "./Component.js";

export interface ComponentDefinition {

    /**
     * Name of the reusable component.
     * Example:
     * component MotorStarter { ... }
     */
    name: string;

    /**
     * Components contained inside this definition.
     */
    components: Component[];

}