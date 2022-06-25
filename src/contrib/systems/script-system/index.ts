import type {
  System,
  SystemOptions,
  UpdateOptions,
  HelperFn,
} from '../../../engine/system';
import type { GameObjectObserver, GameObject } from '../../../engine/game-object';
import type { Store } from '../../../engine/scene/store';
import type { MessageBus } from '../../../engine/message-bus';
import type { ScriptComponent } from '../../components/script';

import type { Script, ScriptOptions } from './script';

const SCRIPT_COMPONENT_NAME = 'script';

export { Script, ScriptOptions };

export interface ScriptClass {
  new(options: ScriptOptions): Script
}

export class ScriptSystem implements System {
  private gameObjectObserver: GameObjectObserver;
  private scriptsObserver: GameObjectObserver;
  private gameObjectSpawner: unknown;
  private gameObjectDestroyer: unknown;
  private store: Store;
  private scripts: Record<string, ScriptClass>;
  private messageBus: MessageBus;
  private activeScripts: Record<string, Script>;
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
        SCRIPT_COMPONENT_NAME,
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
    this.scripts = scripts as Record<string, ScriptClass>;
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
      .reduce((acc: Record<string, Script>, key) => {
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
      } = gameObject.getComponent(SCRIPT_COMPONENT_NAME) as ScriptComponent;

      const Script = this.scripts[name];

      this.activeScripts[id] = this.activeScripts[id]
        || new Script({
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
