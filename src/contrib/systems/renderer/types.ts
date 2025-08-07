export interface SortingLayer {
  id: string;
  name: string;
}

export type SortingOrder =
  | 'bottom right'
  | 'bottom left'
  | 'top left'
  | 'top right';

export interface Sorting {
  layers: SortingLayer[];
  order: SortingOrder;
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}
