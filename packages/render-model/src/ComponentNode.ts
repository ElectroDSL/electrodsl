export interface ComponentNode {
  id: string;

  symbol: string;

  x: number;

  y: number;

  rotation: number;

  width: number;

  height: number;

  properties: Record<string, string>;
}