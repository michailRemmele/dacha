import type { SceneConfig, EntityConfig } from '../types';
import type { SystemOptions, HelperFn } from '../system';
import { System } from '../system';
import {
  EntityObserver,
  EntityObserverFilter,
  Entity,
  EntitySpawner,
  EntityDestroyer,
  EntityCreator,
} from '../entity';
import { MessageBus } from '../message-bus';

import { SceneContext } from './context';
import { Store } from './store';
import { ENTITY_ADDED, ENTITY_REMOVED } from './consts';

export interface EntityChangeEvent {
  type: string
  entity: Entity
}

interface SceneOptions extends SceneConfig {
  entities: Array<EntityConfig>
  availableSystems: Record<string, { new(options: SystemOptions): System }>
  helpers: Record<string, HelperFn>
  entityCreator: EntityCreator
}

export class Scene {
  private name: string;
  private entities: Record<string, Entity>;
  private store: Store;
  private context: SceneContext;
  private entityCreator: EntityCreator;
  private entitySpawner: EntitySpawner;
  private entityDestroyer: EntityDestroyer;
  private messageBus: MessageBus;
  private systems: Array<System>;
  private entitiesChangeSubscribers: Array<(event: EntityChangeEvent) => void>;

  constructor({
    name,
    entities,
    systems,
    helpers,
    entityCreator,
    availableSystems,
  }: SceneOptions) {
    this.name = name;
    this.entities = {};
    this.entitiesChangeSubscribers = [];
    this.store = new Store();
    this.entityCreator = entityCreator;
    this.entitySpawner = new EntitySpawner(this, this.entityCreator);
    this.entityDestroyer = new EntityDestroyer(this);
    this.messageBus = new MessageBus();
    this.context = new SceneContext(this.name);

    entities.forEach((entityOptions) => {
      this.entityCreator.create(entityOptions).forEach((entity: Entity) => {
        this.addEntity(entity);
      });
    });

    this.systems = systems.map((config) => new availableSystems[config.name]({
      ...config.options,
      store: this.getStore(),
      entitySpawner: this.getEntitySpawner(),
      entityDestroyer: this.getEntityDestroyer(),
      createEntityObserver: (filter): EntityObserver => this.createEntityObserver(filter),
      messageBus: this.getMessageBus(),
      helpers,
      sceneContext: this.context,
    }));
  }

  load(): Promise<Array<void>> | undefined {
    if (this.systems.every((system) => !system.load)) {
      return void 0;
    }

    return Promise.all(this.systems.map((system) => {
      if (system.load) {
        return system.load();
      }
      return Promise.resolve();
    }));
  }

  mount(): void {
    this.systems.forEach((system) => {
      if (system.mount) {
        system.mount();
      }
    });
  }

  unmount(): void {
    this.systems.forEach((system) => {
      if (system.unmount) {
        system.unmount();
      }
    });
  }

  getSystems(): Array<System> {
    return this.systems;
  }

  getStore(): Store {
    return this.store;
  }

  createEntityObserver(filter: EntityObserverFilter): EntityObserver {
    return new EntityObserver(this, filter);
  }

  getEntitySpawner(): EntitySpawner {
    return this.entitySpawner;
  }

  getEntityDestroyer(): EntityDestroyer {
    return this.entityDestroyer;
  }

  getMessageBus(): MessageBus {
    return this.messageBus;
  }

  addEntity(entity: Entity): void {
    const id = entity.getId();

    if (this.entities[id]) {
      throw new Error(`The game object with same id already exists: ${id}`);
    }

    this.entities[id] = entity;

    this.entitiesChangeSubscribers.forEach((callback) => {
      callback({
        type: ENTITY_ADDED,
        entity,
      });
    });
  }

  removeEntity(entity: Entity): void {
    entity.clearSubscriptions();
    this.entities = Object.keys(this.entities)
      .reduce((acc: Record<string, Entity>, key) => {
        if (key !== entity.getId()) {
          acc[key] = this.entities[key];
        }

        return acc;
      }, {});

    this.entitiesChangeSubscribers.forEach((callback) => {
      callback({
        type: ENTITY_REMOVED,
        entity,
      });
    });
  }

  getName(): string {
    return this.name;
  }

  getEntities(): Array<Entity> {
    return Object.values(this.entities);
  }

  subscribeOnEntitiesChange(callback: (event: EntityChangeEvent) => void): void {
    if (!(callback instanceof Function)) {
      throw new Error('On subscribe callback should be a function');
    }

    this.entitiesChangeSubscribers.push(callback);
  }
}
