import type {
  System,
  SystemOptions,
  UpdateOptions,
  HelperFn,
} from '../../../engine/system';
import type { GameObjectObserver, GameObject } from '../../../engine/game-object';
import type { Store } from '../../../engine/scene/store';
import type { MessageBus } from '../../../engine/message-bus';
import { Script } from '../../components/script';

import type { GameObjectScript, GameObjectScriptOptions } from './types';

export { GameObjectScript, GameObjectScriptOptions };

export interface GameObjectScriptClass {
  new(options: GameObjectScriptOptions): GameObjectScript
}

export class ScriptSystem implements System {
  private gameObjectObserver: GameObjectObserver;
  private scriptsObserver: GameObjectObserver;
  private gameObjectSpawner: unknown;
  private gameObjectDestroyer: unknown;
  private store: Store;
  private scripts: Record<string, GameObjectScriptClass>;
  private messageBus: MessageBus;
  private activeScripts: Record<string, GameObjectScript>;
  private helpers: Record<string, HelperFn>;

  constructor(options: SystemOptions) {
    const {
      createGameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
      messageBus,
      helpers,
    } = options;

    this.gameObjectObserver = createGameObjectObserver({});
    this.scriptsObserver = createGameObjectObserver({
      components: [
        Script,
      ],
    });
    this.gameObjectSpawner = gameObjectSpawner;
    this.gameObjectDestroyer = gameObjectDestroyer;
    this.store = store;
    this.scripts = {};
    this.messageBus = messageBus;
    this.helpers = helpers;

    this.activeScripts = {};
  }

  async load(): Promise<void> {
    const { scripts } = await this.helpers.loadScripts();
    this.scripts = scripts as Record<string, GameObjectScriptClass>;
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

    this.scriptsObserver.fireEvents();

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
          store: this.store,
          spawner: this.gameObjectSpawner,
          destroyer: this.gameObjectDestroyer,
          ...scriptOptions,
        });

      this.activeScripts[id].update(deltaTime);
    });
  }
}
