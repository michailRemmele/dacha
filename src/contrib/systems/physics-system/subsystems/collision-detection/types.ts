import type { Vector2, Point } from '../../../../../engine/math-lib';
import type { Actor } from '../../../../../engine/actor';
import type { CastHit, OverlapHit } from '../../types';

import type { DispersionCalculator } from './dispersion-calculator';

export type { Point };

export interface AABB {
  min: Point;
  max: Point;
}

export interface Edge {
  point1: Point;
  point2: Point;
}

export interface EdgeWithNormal extends Edge {
  normal: Vector2;
}

export interface BoxGeometry {
  center: Point;
  points: Point[];
  edges: EdgeWithNormal[];
}

export interface CircleGeometry {
  center: Point;
  radius: number;
}

export interface SegmentGeometry {
  center: Point;
  point1: Point;
  point2: Point;
  normal: Vector2;
}

export interface CapsuleGeometry extends SegmentGeometry {
  radius: number;
}

export interface PointGeometry {
  center: Point;
}

export interface ActorGeometryParams {
  offset?: Point;
}

export interface RayGeometry {
  origin: Point;
  direction: Vector2;
  maxDistance: number;
}

export interface CircleCastGeometry extends CircleGeometry, RayGeometry {}

export interface CapsuleCastGeometry extends CapsuleGeometry, RayGeometry {
  cap1: CircleCastGeometry;
  cap2: CircleCastGeometry;
  box: BoxCastGeometry | null;
}

export interface BoxCastGeometry extends BoxGeometry, RayGeometry {
  halfExtents: Point;
}

export type Geometry =
  | BoxGeometry
  | CircleGeometry
  | SegmentGeometry
  | CapsuleGeometry
  | PointGeometry
  | RayGeometry
  | CircleCastGeometry
  | CapsuleCastGeometry
  | BoxCastGeometry;

export interface OrientationData {
  transform: {
    positionX: number;
    positionY: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
  };
  collider: {
    type: string;
    layer: string;
    offsetX: number;
    offsetY: number;
    radius?: number;
    height?: number;
    sizeX?: number;
    sizeY?: number;
    point1X?: number;
    point1Y?: number;
    point2X?: number;
    point2Y?: number;
  };
}

export interface ActorProxy {
  actor: Actor;
  aabb: AABB;
  geometry: Geometry;
  orientationData: OrientationData;
  edges: Record<Axis, [SortedItem, SortedItem]>;
  layer: string;
}

export interface QueryProxy {
  aabb: AABB;
  geometry: Geometry;
  layer?: string;
  excludedActors?: Set<Actor>;
  actorFilter?: (actor: Actor) => boolean;
  hitFilter?: (hit: OverlapHit | CastHit) => boolean;
}

export type Proxy = ActorProxy | QueryProxy;

export interface SortedItem {
  proxy: ActorProxy;
  value: number;
}

export interface AxisEntry {
  sortedList: SortedItem[];
  dispersionCalculator: DispersionCalculator;
}

export type Axis = 'x' | 'y';

export interface Axes {
  x: AxisEntry;
  y: AxisEntry;
}

export type ProxyPair = [ActorProxy, ActorProxy];

export interface Contact {
  actor1: Actor;
  actor2: Actor;
  normal: Vector2;
  penetration: number;
  contactPoints: Point[];
}

export interface Intersection {
  normal: Vector2;
  penetration: number;
  contactPoints: Point[];
  distance?: number;
}
