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

export interface BoxGeometry {
  center: Point
  points: Point[]
  edges: EdgeWithNormal[]
};

export interface CircleGeometry {
  center: Point
  radius: number
};

export type Geometry = BoxGeometry | CircleGeometry;

export interface OrientationData {
  transform: {
    positionX: number
    positionY: number
    rotation: number
    scaleX: number
    scaleY: number
  }
  collider: {
    type: string
    centerX: number
    centerY: number
    radius?: number
    sizeX?: number
    sizeY?: number
  }
}

export interface CollisionEntry {
  actor: Actor
  aabb: AABB
  geometry: Geometry
  orientationData: OrientationData
  edges: Record<Axis, [SortedItem, SortedItem]>
}

export interface SortedItem {
  entry: CollisionEntry
  value: number
}

export interface AxisEntry {
  sortedList: SortedItem[]
  dispersionCalculator: DispersionCalculator
}

export type Axis = 'x' | 'y';

export interface Axes {
  x: AxisEntry
  y: AxisEntry
}

export type CollisionPair = [CollisionEntry, CollisionEntry];

export interface Intersection {
  mtv1: Vector2
  mtv2: Vector2
};
