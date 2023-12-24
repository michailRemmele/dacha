import type {
  GameObjectObserver,
  GameObjectObserverFilter,
  GameObjectSpawner,
  GameObjectDestroyer,
} from '../game-object';
import type { TemplateCollection } from '../template';
import type { SceneContext } from '../scene';
import type { MessageBus, MessageEmitter } from '../message-bus';
import type { Constructor } from '../../types/utils';

export interface SystemOptions extends Record<string, unknown> {
  createGameObjectObserver: (filter: GameObjectObserverFilter) => GameObjectObserver
  gameObjectSpawner: GameObjectSpawner
  gameObjectDestroyer: GameObjectDestroyer
  resources?: unknown
  globalOptions: Record<string, unknown>
  messageBus: MessageBus
  messageEmitter: MessageEmitter
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
  update?(options: UpdateOptions): void;
}

export type SystemConstructor = Constructor<System> & { systemName: string };
