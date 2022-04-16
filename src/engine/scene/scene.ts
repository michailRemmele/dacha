import { GAME_OBJECT_CREATOR_KEY_NAME } from '../consts/global';
import { System } from '../system';
import IOC from '../ioc/ioc';
import {
  EntityObserver,
  EntityObserverFilter,
  Entity,
  EntitySpawner,
  EntityDestroyer,
} from '../entity';
import { MessageBus } from '../message-bus';

import { Store } from './store';
import { GAME_OBJECT_ADDED, GAME_OBJECT_REMOVED } from './consts';

// TODO: Remove once game object creator will be moved to ts
interface EntityCreator {
  create(options: unknown): Array<Entity>;
}

export interface SceneOptions {
  name: string;
  entities: Array<unknown>;
}

export interface EntityChangeEvent {
  type: string;
  entity: Entity;
}

export class Scene {
  private _name: string;
  private _entities: Record<string, Entity>;
  private _store: Store;
  private _entityCreator: EntityCreator;
  private _entitySpawner: unknown;
  private _entityDestroyer: unknown;
  private messageBus: MessageBus;
  private _systems: Array<System>;
  private _entitiesChangeSubscribers: Array<(event: EntityChangeEvent) => void>;

  constructor(options: SceneOptions) {
    const { name, entities } = options;

    this._name = name;
    this._entities = {};
    this._store = new Store();
    this._entityCreator = IOC.resolve(GAME_OBJECT_CREATOR_KEY_NAME) as EntityCreator;
    this._entitySpawner = new EntitySpawner(this, this._entityCreator);
    this._entityDestroyer = new EntityDestroyer(this);
    this.messageBus = new MessageBus();

    this._systems = [];

    this._entitiesChangeSubscribers = [];

    entities.forEach((entityOptions) => {
      this._entityCreator.create(entityOptions).forEach((entity: Entity) => {
        this.addEntity(entity);
      });
    });
  }

  mount() {
    this._systems.forEach((system) => {
      if (system.systemDidMount) {
        system.systemDidMount();
      }
    });
  }

  unmount() {
    this._systems.forEach((system) => {
      if (system.systemWillUnmount) {
        system?.systemWillUnmount();
      }
    });
  }

  addSystem(proccessor: System) {
    this._systems.push(proccessor);
  }

  getSystems() {
    return this._systems;
  }

  getStore() {
    return this._store;
  }

  createEntityObserver(filter: EntityObserverFilter) {
    return new EntityObserver(this, filter);
  }

  getEntitySpawner() {
    return this._entitySpawner;
  }

  getEntityDestroyer() {
    return this._entityDestroyer;
  }

  getMessageBus() {
    return this.messageBus;
  }

  addEntity(entity: Entity) {
    const id = entity.getId();

    if (this._entities[id]) {
      throw new Error(`The game object with same id already exists: ${id}`);
    }

    this._entities[id] = entity;

    this._entitiesChangeSubscribers.forEach((callback) => {
      callback({
        type: GAME_OBJECT_ADDED,
        entity,
      });
    });
  }

  removeEntity(entity: Entity) {
    entity.clearSubscriptions();
    this._entities = Object.keys(this._entities)
      .reduce((acc: Record<string, Entity>, key) => {
        if (key !== entity.getId()) {
          acc[key] = this._entities[key];
        }

        return acc;
      }, {});

    this._entitiesChangeSubscribers.forEach((callback) => {
      callback({
        type: GAME_OBJECT_REMOVED,
        entity,
      });
    });
  }

  getName() {
    return this._name;
  }

  getEntities() {
    return Object.values(this._entities);
  }

  subscribeOnEntitiesChange(callback: (event: EntityChangeEvent) => void) {
    if (!(callback instanceof Function)) {
      throw new Error('On subscribe callback should be a function');
    }

    this._entitiesChangeSubscribers.push(callback);
  }
}
