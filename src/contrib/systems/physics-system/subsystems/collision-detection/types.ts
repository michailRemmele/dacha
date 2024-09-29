import type { Vector2 } from '../../../../../engine/math-lib';
import type { Actor } from '../../../../../engine/actor';
import type { AABB } from './aabb-builders';
import type { DispersionCalculator } from './dispersion-calculator';

export interface Point {
  x: number
  y: number
}

export interface Edge {
  point1: Point
  point2: Point
  normal: Vector2
}

export interface Coordinates {
  center: Point
  points: Array<Point>
  edges: Array<Edge>
}

export interface CollisionEntry {
  actor: Actor
  aabb: AABB
  coordinates: Coordinates
}

export interface SortedItem {
  entry: CollisionEntry
  value: number
}

export interface AxisEntry {
  sortedList: Array<SortedItem>
  dispersionCalculator: DispersionCalculator
}

export type Axis = 'x' | 'y';

export interface Axes {
  x: AxisEntry
  y: AxisEntry
}

export type CollisionPair = Array<CollisionEntry>;
