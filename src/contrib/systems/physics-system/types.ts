import type { SceneSystemOptions } from '../../../engine/system';

export interface PhysicsSystemOptions extends SceneSystemOptions {
  gravity: number;
}

export interface CollisionLayer {
  id: string;
  name: string;
}

export type CollisionMatrix = Record<string, Record<string, boolean>>;

export interface PhysicsSettings {
  collisionLayers: CollisionLayer[];
  collisionMatrix: CollisionMatrix;
}
