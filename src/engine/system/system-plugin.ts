import type { GameObjectObserver, GameObjectObserverFilter } from '../gameObject';
import type { Store } from '../scene';
import type { MessageBus } from '../message-bus';

import type { System } from './system';

export interface PluginHelperFn {
  <T = unknown>(): Promise<Record<string, T>>
}

export interface SystemPluginOptions {
  createGameObjectObserver: (filter: GameObjectObserverFilter) => GameObjectObserver;
  gameObjectSpawner: unknown,
  gameObjectDestroyer: unknown,
  sceneController: unknown,
  helpers: Record<string, PluginHelperFn>,
  store: Store;
  messageBus: MessageBus;
}

export interface SystemPlugin {
  load(options: SystemPluginOptions): Promise<System> | System;
}
