import type { System, SystemOptions } from '../../../engine/system';
import type { EntityObserver, Entity } from '../../../engine/entity';
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
  entityObserver: EntityObserver
  scriptsObserver: EntityObserver
  entitySpawner: unknown
  entityDestroyer: unknown
  store: Store
  messageBus: MessageBus
  scripts: Record<string, ScriptClass>
}

export class ScriptSystem implements System {
  private entityObserver: EntityObserver;
  private scriptsObserver: EntityObserver;
  private entitySpawner: unknown;
  private entityDestroyer: unknown;
  private store: Store;
  private scripts: Record<string, ScriptClass>;
  private messageBus: MessageBus;
  private activeScripts: Record<string, Script>;

  constructor(options: ScriptSystemOptions) {
    const {
      entityObserver,
      scriptsObserver,
      entitySpawner,
      entityDestroyer,
      store,
      scripts,
      messageBus,
    } = options;

    this.entityObserver = entityObserver;
    this.scriptsObserver = scriptsObserver;
    this.entitySpawner = entitySpawner;
    this.entityDestroyer = entityDestroyer;
    this.store = store;
    this.scripts = scripts;
    this.messageBus = messageBus;

    this.activeScripts = {};
  }

  systemDidMount(): void {
    this.scriptsObserver.subscribe('onremove', this.handleEntityRemove);
  }

  systemWillUnmount(): void {
    this.scriptsObserver.unsubscribe('onremove', this.handleEntityRemove);
  }

  private handleEntityRemove = (entity: Entity): void => {
    const entityId = entity.getId();

    this.activeScripts = Object.keys(this.activeScripts)
      .reduce((acc: Record<string, Script>, key) => {
        if (key !== entityId) {
          acc[key] = this.activeScripts[key];
        }

        return acc;
      }, {});
  };

  update(options: SystemOptions): void {
    const { deltaTime } = options;

    this.scriptsObserver.fireEvents();

    this.scriptsObserver.forEach((entity) => {
      const id = entity.getId();
      const {
        name,
        options: scriptOptions,
      } = entity.getComponent(SCRIPT_COMPONENT_NAME) as ScriptComponent;

      const Script = this.scripts[name];

      this.activeScripts[id] = this.activeScripts[id]
        || new Script({
          entity,
          entityObserver: this.entityObserver,
          messageBus: this.messageBus,
          store: this.store,
          spawner: this.entitySpawner,
          destroyer: this.entityDestroyer,
          ...scriptOptions,
        });

      this.activeScripts[id].update(deltaTime);
    });
  }
}
