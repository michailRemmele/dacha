import type {
  System,
  SystemOptions,
  UpdateOptions,
  HelperFn,
} from '../../../engine/system';
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

export class ScriptSystem implements System {
  private entityObserver: EntityObserver;
  private scriptsObserver: EntityObserver;
  private entitySpawner: unknown;
  private entityDestroyer: unknown;
  private store: Store;
  private scripts: Record<string, ScriptClass>;
  private messageBus: MessageBus;
  private activeScripts: Record<string, Script>;
  private helpers: Record<string, HelperFn>;

  constructor(options: SystemOptions) {
    const {
      createEntityObserver,
      entitySpawner,
      entityDestroyer,
      store,
      messageBus,
      helpers,
    } = options;

    this.entityObserver = createEntityObserver({});
    this.scriptsObserver = createEntityObserver({
      components: [
        SCRIPT_COMPONENT_NAME,
      ],
    });
    this.entitySpawner = entitySpawner;
    this.entityDestroyer = entityDestroyer;
    this.store = store;
    this.scripts = {};
    this.messageBus = messageBus;
    this.helpers = helpers;

    this.activeScripts = {};
  }

  async load(): Promise<void> {
    const { scripts } = await this.helpers.loadScripts<Record<string, ScriptClass>>();
    this.scripts = scripts;
  }

  mount(): void {
    this.scriptsObserver.subscribe('onremove', this.handleEntityRemove);
  }

  unmount(): void {
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

  update(options: UpdateOptions): void {
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
