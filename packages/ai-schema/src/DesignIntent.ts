export interface DesignIntent {

    name: string;

    description?: string;

    application:
        | "motor_control"
        | "power_distribution"
        | "automation"
        | "lighting"
        | "unknown";

    voltage?: string;

    frequency?: string;

    standards?: string[];

    requirements?: string[];

}