/**
 * Represents a single electrical connection point on a component.
 *
 * Examples:
 * - L1
 * - L2
 * - L3
 * - T1
 * - T2
 * - A1
 * - A2
 * - PE
 */
export interface ElectricalPort {
  /**
   * Unique identifier of the port within the graph.
   */
  id: string;

  /**
   * ID of the parent node that owns this port.
   */
  nodeId: string;

  /**
   * Port name shown on the component.
   * Example: L1, T1, A1, PE
   */
  name: string;

  /**
   * Optional description.
   */
  description?: string;

  /**
   * Additional implementation-specific metadata.
   */
  metadata?: Record<string, unknown>;
}