import type {
  GameObjectObserver,
  GameObjectObserverFilter,
  GameObjectSpawner,
  GameObjectDestroyer,
} from '../game-object';
import type { TemplateCollection } from '../template';
import type { Store, SceneContext } from '../scene';
import type { MessageBus } from '../message-bus';
import type { Constructor } from '../../types/utils';

export type HelperFn = () => Promise<Record<string, unknown>>;

export interface SystemOptions extends Record<string, unknown> {
  createGameObjectObserver: (filter: GameObjectObserverFilter) => GameObjectObserver
  gameObjectSpawner: GameObjectSpawner
  gameObjectDestroyer: GameObjectDestroyer
  helpers: Record<string, HelperFn>
  globalOptions: Record<string, unknown>
  store: Store
  messageBus: MessageBus
  sceneContext: SceneContext
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
  abstract update(options: UpdateOptions): void;
}

export type SystemConstructor = Constructor<System> & { systemName: string };
