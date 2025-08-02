export interface SortingLayer {
  id: string;
  name: string;
}

export interface SortingLayers {
  layers: SortingLayer[];
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}
