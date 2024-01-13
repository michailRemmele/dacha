import type {
  GameObjectObserver,
  GameObjectObserverFilter,
  GameObjectSpawner,
  GameObjectDestroyer,
} from '../game-object';
import type { TemplateCollection } from '../template';
import type { Scene } from '../scene';
import type { Constructor } from '../../types/utils';

export interface SystemOptions extends Record<string, unknown> {
  createGameObjectObserver: (filter: GameObjectObserverFilter) => GameObjectObserver
  gameObjectSpawner: GameObjectSpawner
  gameObjectDestroyer: GameObjectDestroyer
  resources?: unknown
  globalOptions: Record<string, unknown>
  scene: Scene
  templateCollection: TemplateCollection
}

export interface UpdateOptions {
  deltaTime: number;
}

export abstract class System {
  static systemName: string;
  load?(): Promise<void>;
  mount?(): void;
  unmount?(): void;
  update?(options: UpdateOptions): void;
}

export type SystemConstructor = Constructor<System> & { systemName: string };
