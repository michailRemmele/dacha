import type { GameObjectObserver, GameObjectObserverFilter } from '../gameObject';
import type { Store } from '../scene';
import type { MessageBus } from '../message-bus';

import type { Processor } from './processor';

export type PluginHelper = () => Promise<Record<string, unknown>>;

export interface ProcessorPluginOptions {
  createGameObjectObserver: (filter: GameObjectObserverFilter) => GameObjectObserver;
  gameObjectSpawner: unknown,
  gameObjectDestroyer: unknown,
  sceneController: unknown,
  helpers: Record<string, PluginHelper>,
  store: Store;
  messageBus: MessageBus;
}

export interface ProcessorPlugin {
  load(options: ProcessorPluginOptions): Promise<Processor> | Processor;
}
