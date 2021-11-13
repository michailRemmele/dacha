import { GameObjectObserver, GameObjectObserverFilter } from '../gameObject';

import { Processor } from './processor';

export type PluginHelper = () => Promise<Record<string, unknown>>;

export interface ProcessorPluginOptions {
  createGameObjectObserver: (filter: GameObjectObserverFilter) => GameObjectObserver;
  gameObjectSpawner: unknown,
  gameObjectDestroyer: unknown,
  sceneController: unknown,
  helpers: Record<string, PluginHelper>,
  store: Record<string, unknown>;
}

export interface ProcessorPlugin {
  load(options: ProcessorPluginOptions): Promise<Processor> | Processor;
}
