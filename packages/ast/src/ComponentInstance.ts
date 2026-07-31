export interface ComponentInstance {

    /**
     * Instance identifier
     * Example:
     * M1
     */
    id: string;

    /**
     * Reusable component definition name
     * Example:
     * MotorStarter
     */
    type: string;

    /**
     * Optional user-defined properties
     */
    properties?: Record<string, string>;

}