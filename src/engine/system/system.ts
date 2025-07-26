import type { ActorSpawner } from '../actor';
import type { TemplateCollection } from '../template';
import type { Scene } from '../scene';
import type { World } from '../world';
import type { Constructor } from '../../types/utils';

interface SystemOptions extends Record<string, unknown> {
  actorSpawner: ActorSpawner
  resources?: unknown
  globalOptions: Record<string, unknown>
  templateCollection: TemplateCollection
}

export interface SceneSystemOptions extends SystemOptions {
  scene: Scene
  world: World
}

export interface WorldSystemOptions extends SystemOptions {
  world: World
}

export interface UpdateOptions {
  deltaTime: number;
}

export abstract class System {
  static systemName: string;
  onSceneLoad?(scene: Scene): Promise<void>;
  onSceneEnter?(scene: Scene): void;
  onSceneExit?(scene: Scene): void;
  onSceneDestroy?(scene: Scene): void;
  update?(options: UpdateOptions): void;
  fixedUpdate?(options: UpdateOptions): void;
}

export abstract class WorldSystem extends System {
  onWorldLoad?(world: World): Promise<void>;
  onWorldReady?(world: World): void;
  onWorldDestroy?(world: World): void;
}

export abstract class SceneSystem extends System {}

export type SystemConstructor = Constructor<System> & {
  systemName: string
};
