import type { GameObjectObserver, GameObjectObserverFilter } from '../gameObject';
import type { Store } from '../scene';
import type { MessageBus } from '../message-bus';

import type { Processor } from './processor';

export interface PluginHelperFn {
  <T = unknown>(): Promise<Record<string, T>>
}

export interface ProcessorPluginOptions {
  createGameObjectObserver: (filter: GameObjectObserverFilter) => GameObjectObserver;
  gameObjectSpawner: unknown,
  gameObjectDestroyer: unknown,
  sceneController: unknown,
  helpers: Record<string, PluginHelperFn>,
  store: Store;
  messageBus: MessageBus;
}

export interface ProcessorPlugin {
  load(options: ProcessorPluginOptions): Promise<Processor> | Processor;
}
