import type { Vector2 } from '../../../../../engine/math-lib';
import type { Actor } from '../../../../../engine/actor';
import type { DispersionCalculator } from './dispersion-calculator';

export interface Point {
  x: number
  y: number
}

export interface AABB {
  min: Point
  max: Point
}

export interface Edge {
  point1: Point
  point2: Point
}

export interface EdgeWithNormal extends Edge {
  normal: Vector2
}

export type BoxGeometry = {
  center: Point
  points: Array<Point>
  edges: Array<EdgeWithNormal>
};

export type CircleGeometry = {
  center: Point
  radius: number
};

export type Geometry = BoxGeometry | CircleGeometry;

export interface Position {
  offsetX: number
  offsetY: number
}

export interface CollisionEntry {
  actor: Actor
  aabb: AABB
  geometry: Geometry
  position: Position
  edges: Record<Axis, [SortedItem, SortedItem]>
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

export type CollisionPair = [CollisionEntry, CollisionEntry];

export type Intersection = {
  mtv1: Vector2
  mtv2: Vector2
};
