/**
 * Represents an electrical connection between two ports.
 */
export interface ElectricalEdge {
  /**
   * Unique edge identifier.
   */
  id: string;

  /**
   * Source port ID.
   */
  sourcePortId: string;

  /**
   * Target port ID.
   */
  targetPortId: string;

  /**
   * Connection type.
   * Example:
   * power
   * control
   * signal
   */
  type: string;

  /**
   * Additional engineering properties.
   */
  properties?: Record<string, unknown>;

  /**
   * Additional implementation-specific metadata.
   */
  metadata?: Record<string, unknown>;
}