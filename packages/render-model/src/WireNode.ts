export interface Point {
  x: number;
  y: number;
}

export interface WireNode {
  id: string;

  points: Point[];
}