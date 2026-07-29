import type { Layer } from "./Layer";

export interface Page {
  width: number;

  height: number;

  layers: Layer[];
}