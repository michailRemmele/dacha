import { GameObjectObserver } from '../game-object';
import type { GameObjectObserverFilter } from '../game-object';
import type { Scene } from '../scene';
import { MessageEmitter } from '../message-bus';

import { System } from './system';
import type {
  SystemConstructor,
  UpdateOptions,
} from './system';

export interface SystemControllerOptions {
  systemOptions: Record<string, unknown>
  globalOptions: Record<string, unknown>
  resources?: unknown
  scene: Scene
  SystemClass: SystemConstructor
}

export class SystemController extends System {
  private instance: System;
  private gameObjectObservers: Array<GameObjectObserver>;
  private messageEmitter: MessageEmitter;

  constructor({
    systemOptions,
    globalOptions,
    resources,
    scene,
    SystemClass,
  }: SystemControllerOptions) {
    super();

    this.gameObjectObservers = [];
    this.messageEmitter = new MessageEmitter(scene.messageBus);

    const createGameObjectObserver = (filter?: GameObjectObserverFilter): GameObjectObserver => {
      const gameObjectObserver = new GameObjectObserver(scene, filter);
      this.gameObjectObservers.push(gameObjectObserver);
      return gameObjectObserver;
    };

    this.instance = new SystemClass({
      ...systemOptions,
      templateCollection: scene.templateCollection,
      gameObjectSpawner: scene.gameObjectSpawner,
      gameObjectDestroyer: scene.gameObjectDestroyer,
      messageBus: scene.messageBus,
      messageEmitter: this.messageEmitter,
      sceneContext: scene.context,
      createGameObjectObserver,
      resources,
      globalOptions,
    });
  }

  async load(): Promise<void> {
    return this.instance.load?.();
  }

  mount(): void {
    this.instance.mount?.();
  }

  unmount(): void {
    this.instance.unmount?.();
  }

  update(options: UpdateOptions): void {
    this.gameObjectObservers.forEach((gameObjectObserver) => gameObjectObserver.fireEvents());
    this.messageEmitter.fireAll();

    this.instance.update?.(options);
  }
}
