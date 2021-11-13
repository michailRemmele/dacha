import { GameObjectObserver, GameObjectObserverFilter } from '../gameObject';

// TODO: Remove once processor will be moved to ts
export interface ProcessorOptions {
  deltaTime: number;
  messageBus: object;
}

// TODO: Remove once processor will be moved to ts
export interface Processor {
  process(options: ProcessorOptions): void;
}

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
