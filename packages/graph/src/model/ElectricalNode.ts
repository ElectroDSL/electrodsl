import type { ElectricalPort } from "./ElectricalPort.js";

/**
 * Represents an electrical component in the graph.
 *
 * Examples:
 * - Breaker
 * - Motor
 * - Contactor
 * - Relay
 * - PLC
 * - Lamp
 * - Push Button
 */
export interface ElectricalNode {
  /**
   * Unique component identifier.
   * Example: Q1, M1, K1
   */
  id: string;

  /**
   * Component type.
   * Example:
   * breaker
   * motor
   * contactor
   */
  type: string;

  /**
   * Optional human-readable name.
   */
  name?: string;

  /**
   * Connection ports belonging to this component.
   */
  ports: ElectricalPort[];

  /**
   * Engineering properties.
   * Example:
   * voltage
   * current
   * power
   * manufacturer
   */
  properties: Record<string, unknown>;

  /**
   * Additional implementation-specific metadata.
   */
  metadata?: Record<string, unknown>;
}