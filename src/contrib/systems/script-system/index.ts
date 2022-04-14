import type { System, SystemOptions } from '../../../engine/system';
import type { GameObjectObserver, GameObject } from '../../../engine/gameObject';
import type { Store } from '../../../engine/scene/store';
import type { MessageBus } from '../../../engine/message-bus';
import type { Script as ScriptComponent } from '../../components/script';

import type { Script, ScriptOptions } from './script';

const SCRIPT_COMPONENT_NAME = 'script';

export { Script, ScriptOptions };

export interface ScriptClass {
  new(options: ScriptOptions): Script
}

interface ScriptSystemOptions {
  gameObjectObserver: GameObjectObserver
  scriptsObserver: GameObjectObserver
  gameObjectSpawner: unknown
  gameObjectDestroyer: unknown
  store: Store
  messageBus: MessageBus
  scripts: Record<string, ScriptClass>
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

  constructor(options: ScriptSystemOptions) {
    const {
      gameObjectObserver,
      scriptsObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
      scripts,
      messageBus,
    } = options;

    this.gameObjectObserver = gameObjectObserver;
    this.scriptsObserver = scriptsObserver;
    this.gameObjectSpawner = gameObjectSpawner;
    this.gameObjectDestroyer = gameObjectDestroyer;
    this.store = store;
    this.scripts = scripts;
    this.messageBus = messageBus;

    this.activeScripts = {};
  }

  systemDidMount(): void {
    this.scriptsObserver.subscribe('onremove', this.handleGameObjectRemove);
  }

  systemWillUnmount(): void {
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

  update(options: SystemOptions): void {
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
