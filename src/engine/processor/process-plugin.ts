import { GameObjectObserver, GameObjectObserverFilter } from '../gameObject';

export interface ProcessorOptions {
  deltaTime: number;
  messageBus: object;
}

export interface Processor {
  process(options: ProcessorOptions): void;
}

export interface ProcessorPluginOptions {
  createGameObjectObserver: (filter: GameObjectObserverFilter) => GameObjectObserver;
  gameObjectSpawner: unknown,
  gameObjectDestroyer: unknown,
  sceneController: unknown,
  helpers: unknown,
  store: Record<string, unknown>;
}

export interface ProcessorPlugin {
  load(options: ProcessorPluginOptions): Promise<Processor> | Processor;
}
