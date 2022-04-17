import {
  ENTITY_ADDED,
  Scene,
  EntityChangeEvent,
} from '../scene';
import type { EventEmitter } from '../types';

import { Entity } from './entity';

interface ObserverEventMap {
  'onadd': Entity
  'onremove': Entity
}

interface ObserverSubscriptions {
  'onadd': Array<(event: ObserverEventMap['onadd']) => void>
  'onremove': Array<(event: ObserverEventMap['onremove']) => void>
}

export interface EntityObserverFilter {
  type?: string;
  components?: Array<string>;
}

export class EntityObserver implements EventEmitter {
  private _components: Array<string>;
  private _type?: string;
  private _observedEntities: Array<Entity>;
  private _addedToAccepted: Array<Entity>;
  private _removedFromAccepted: Array<Entity>;
  private _acceptedEntities: Array<Entity>;
  private _acceptedEntitiesMap: Record<string, Entity | undefined>;
  private subscriptions: ObserverSubscriptions;

  constructor(scene: Scene, filter: EntityObserverFilter) {
    const {
      type,
      components = [],
    } = filter;

    this._components = components;
    this._type = type;
    this._observedEntities = scene.getEntities();
    this._addedToAccepted = [];
    this._removedFromAccepted = [];
    this._acceptedEntitiesMap = {};
    this.subscriptions = {
      onadd: [],
      onremove: [],
    };
    this._acceptedEntities = this._observedEntities.filter((entity) => {
      entity.subscribe(this._subscribeEntity.bind(this));

      if (!this._test(entity)) {
        return false;
      }

      this._acceptedEntitiesMap[entity.getId()] = entity;
      this._addedToAccepted.push(entity);

      return true;
    });

    scene.subscribeOnEntitiesChange((event) => {
      const { entity } = event;

      if (event.type === ENTITY_ADDED) {
        entity.subscribe(this._subscribeEntity.bind(this));
        this._add(entity);
      } else {
        this._remove(entity);
      }
    });
  }

  private _subscribeEntity(event: EntityChangeEvent) {
    const { entity } = event;

    if (this._test(entity)) {
      this._accept(entity);
    } else {
      this._decline(entity);
    }
  }

  private _add(entity: Entity) {
    this._observedEntities.push(entity);

    if (this._test(entity)) {
      this._accept(entity);
    }
  }

  private _remove(entity: Entity) {
    const remove = (entities: Array<Entity>, id: string) => entities.filter(
      (item) => id !== item.getId(),
    );

    const entityId = entity.getId();

    this._observedEntities = remove(this._observedEntities, entityId);
    this._acceptedEntities = remove(this._acceptedEntities, entityId);
    this._acceptedEntitiesMap[entityId] = void 0;

    this._removedFromAccepted.push(entity);
  }

  private _test(entity: Entity) {
    if (this._type && this._type !== entity.type) {
      return false;
    }

    return this._components.every((component) => entity.getComponent(component));
  }

  private _accept(entity: Entity) {
    const entityId = entity.getId();

    if (this._acceptedEntitiesMap[entityId]) {
      return;
    }

    this._acceptedEntities.push(entity);
    this._acceptedEntitiesMap[entityId] = entity;

    this._addedToAccepted.push(entity);
  }

  private _decline(entity: Entity) {
    const entityId = entity.getId();

    if (!this._acceptedEntitiesMap[entityId]) {
      return;
    }

    this._acceptedEntities = this._acceptedEntities.filter(
      (acceptedEntity) => entityId !== acceptedEntity.getId(),
    );
    this._acceptedEntitiesMap[entityId] = void 0;

    this._removedFromAccepted.push(entity);
  }

  size() {
    return this._acceptedEntities.length;
  }

  getById(id: string) {
    return this._acceptedEntitiesMap[id];
  }

  getByIndex(index: number) {
    return this._acceptedEntities[index];
  }

  forEach(callback: (entity: Entity, index: number) => void) {
    this._acceptedEntities.forEach(callback);
  }

  map(callback: (entity: Entity, index: number) => unknown) {
    return this._acceptedEntities.map(callback);
  }

  sort(compareFunction: (a: Entity, b: Entity) => number) {
    this._acceptedEntities = this._acceptedEntities.sort(compareFunction);
  }

  getList(): Array<Entity> {
    return this._acceptedEntities;
  }

  subscribe<K extends keyof ObserverEventMap>(
    type: K,
    callback: (event: ObserverEventMap[K]) => void,
  ) {
    if (!this.subscriptions[type]) {
      return;
    }

    this.subscriptions[type].push(callback);
  }

  unsubscribe<K extends keyof ObserverEventMap>(
    type: K,
    callback: (event: ObserverEventMap[K]) => void,
  ) {
    if (!this.subscriptions[type]) {
      return;
    }

    this.subscriptions[type] = this.subscriptions[type].filter(
      (currentCallback: (entity: Entity) => void) => callback !== currentCallback,
    );
  }

  fireEvents() {
    this.subscriptions.onadd.forEach((callback: (entity: Entity) => void) => {
      this._addedToAccepted.forEach((entity: Entity) => callback(entity));
    });
    this._addedToAccepted = [];

    this.subscriptions.onremove.forEach((callback: (entity: Entity) => void) => {
      this._removedFromAccepted.forEach((entity: Entity) => callback(entity));
    });
    this._removedFromAccepted = [];
  }
}
