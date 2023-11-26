import { System } from '../../../engine/system';
import type {
  SystemOptions,
  UpdateOptions,
} from '../../../engine/system';
import type { GameObjectObserver, GameObject } from '../../../engine/game-object';
import type { MessageBus } from '../../../engine/message-bus';
import { Script } from '../../components/script';

import type { GameObjectScript, GameObjectScriptOptions } from './types';

export { GameObjectScript, GameObjectScriptOptions };

export interface GameObjectScriptClass {
  new(options: GameObjectScriptOptions): GameObjectScript
}

export class ScriptSystem extends System {
  private gameObjectObserver: GameObjectObserver;
  private scriptsObserver: GameObjectObserver;
  private gameObjectSpawner: unknown;
  private gameObjectDestroyer: unknown;
  private scripts: Record<string, GameObjectScriptClass>;
  private messageBus: MessageBus;
  private activeScripts: Record<string, GameObjectScript>;

  constructor(options: SystemOptions) {
    super();

    const {
      createGameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      messageBus,
      resources = {},
    } = options;

    this.gameObjectObserver = createGameObjectObserver({});
    this.scriptsObserver = createGameObjectObserver({
      components: [
        Script,
      ],
    });
    this.gameObjectSpawner = gameObjectSpawner;
    this.gameObjectDestroyer = gameObjectDestroyer;
    this.scripts = resources as Record<string, GameObjectScriptClass>;
    this.messageBus = messageBus;

    this.activeScripts = {};
  }

  mount(): void {
    this.scriptsObserver.subscribe('onremove', this.handleGameObjectRemove);
  }

  unmount(): void {
    this.scriptsObserver.unsubscribe('onremove', this.handleGameObjectRemove);
  }

  private handleGameObjectRemove = (gameObject: GameObject): void => {
    const gameObjectId = gameObject.getId();

    this.activeScripts = Object.keys(this.activeScripts)
      .reduce((acc: Record<string, GameObjectScript>, key) => {
        if (key !== gameObjectId) {
          acc[key] = this.activeScripts[key];
        }

        return acc;
      }, {});
  };

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.scriptsObserver.forEach((gameObject) => {
      const id = gameObject.getId();
      const {
        name,
        options: scriptOptions,
      } = gameObject.getComponent(Script);

      const SelectedGameObjectScript = this.scripts[name];

      this.activeScripts[id] = this.activeScripts[id]
        || new SelectedGameObjectScript({
          gameObject,
          gameObjectObserver: this.gameObjectObserver,
          messageBus: this.messageBus,
          spawner: this.gameObjectSpawner,
          destroyer: this.gameObjectDestroyer,
          ...scriptOptions,
        });

      this.activeScripts[id].update(deltaTime);
    });
  }
}

ScriptSystem.systemName = 'ScriptSystem';
