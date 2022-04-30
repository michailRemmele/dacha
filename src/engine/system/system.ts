import type { EntityObserver, EntityObserverFilter } from '../entity';
import type { Store, SceneContext } from '../scene';
import type { MessageBus } from '../message-bus';

export interface HelperFn {
  <T = unknown>(): Promise<Record<string, T>>
}

export interface SystemOptions {
  createEntityObserver: (filter: EntityObserverFilter) => EntityObserver
  entitySpawner: unknown
  entityDestroyer: unknown
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
