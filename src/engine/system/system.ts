import type { GameObjectObserver, GameObjectObserverFilter } from '../game-object';
import type { Store, SceneContext } from '../scene';
import type { MessageBus } from '../message-bus';

export interface HelperFn {
  <T = unknown>(): Promise<Record<string, T>>
}

export interface SystemOptions {
  createGameObjectObserver: (filter: GameObjectObserverFilter) => GameObjectObserver
  gameObjectSpawner: unknown
  gameObjectDestroyer: unknown
  helpers: Record<string, HelperFn>
  store: Store
  messageBus: MessageBus
  sceneContext: SceneContext
}

export interface UpdateOptions {
  deltaTime: number;
}

export interface System {
  load?(): Promise<void>
  mount?(): void;
  unmount?(): void;
  update(options: UpdateOptions): void;
}
