import type {
  GameObjectObserver,
  GameObjectObserverFilter,
  GameObjectSpawner,
  GameObjectDestroyer,
} from '../game-object';
import type { Store, SceneContext } from '../scene';
import type { MessageBus } from '../message-bus';

export type HelperFn = () => Promise<Record<string, unknown>>;

export type SystemOptions = {
  createGameObjectObserver: (filter: GameObjectObserverFilter) => GameObjectObserver
  gameObjectSpawner: GameObjectSpawner
  gameObjectDestroyer: GameObjectDestroyer
  helpers: Record<string, HelperFn>
  store: Store
  messageBus: MessageBus
  sceneContext: SceneContext
};

export interface UpdateOptions {
  deltaTime: number;
}

export interface System {
  load?(): Promise<void>
  mount?(): void;
  unmount?(): void;
  update(options: UpdateOptions): void;
}

export type SystemsMap = Record<string, new (options: SystemOptions) => System>;
