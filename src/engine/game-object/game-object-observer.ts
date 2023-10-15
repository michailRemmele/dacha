import { GAME_OBJECT_ADDED } from '../scene/consts';
import type { Scene, GameObjectChangeEvent } from '../scene';
import type { EventEmitter } from '../types';
import type { ComponentConstructor } from '../component';

import type { GameObject } from './game-object';

interface ObserverEventMap {
  'onadd': GameObject
  'onremove': GameObject
}

type GetObjectsToRemoveFn = (gameObjects: Array<GameObject>, id: string) => Array<GameObject>;

interface ObserverSubscriptions {
  'onadd': Array<(event: ObserverEventMap['onadd']) => void>
  'onremove': Array<(event: ObserverEventMap['onremove']) => void>
}

export interface GameObjectObserverFilter {
  type?: string;
  components?: Array<ComponentConstructor | string>;
}

export class GameObjectObserver implements EventEmitter {
  private _components: Array<ComponentConstructor | string>;
  private _type?: string;
  private _observedGameObjects: Array<GameObject>;
  private _addedToAccepted: Array<GameObject>;
  private _removedFromAccepted: Array<GameObject>;
  private _acceptedGameObjects: Array<GameObject>;
  private _acceptedGameObjectsMap: Record<string, GameObject | undefined>;
  private subscriptions: ObserverSubscriptions;

  constructor(scene: Scene, filter: GameObjectObserverFilter) {
    const {
      type,
      components = [],
    } = filter;

    this._components = components;
    this._type = type;
    this._observedGameObjects = scene.getGameObjects();
    this._addedToAccepted = [];
    this._removedFromAccepted = [];
    this._acceptedGameObjectsMap = {};
    this.subscriptions = {
      onadd: [],
      onremove: [],
    };
    this._acceptedGameObjects = this._observedGameObjects.filter((gameObject) => {
      gameObject.subscribe(this._subscribeGameObject.bind(this));

      if (!this._test(gameObject)) {
        return false;
      }

      this._acceptedGameObjectsMap[gameObject.getId()] = gameObject;
      this._addedToAccepted.push(gameObject);

      return true;
    });

    scene.subscribeOnGameObjectsChange((event) => {
      const { gameObject } = event;

      if (event.type === GAME_OBJECT_ADDED) {
        gameObject.subscribe(this._subscribeGameObject.bind(this));
        this._add(gameObject);
      } else {
        this._remove(gameObject);
      }
    });
  }

  private _subscribeGameObject(event: GameObjectChangeEvent): void {
    const { gameObject } = event;

    if (this._test(gameObject)) {
      this._accept(gameObject);
    } else {
      this._decline(gameObject);
    }
  }

  private _add(gameObject: GameObject): void {
    this._observedGameObjects.push(gameObject);

    if (this._test(gameObject)) {
      this._accept(gameObject);
    }
  }

  private _remove(gameObject: GameObject): void {
    const remove: GetObjectsToRemoveFn = (gameObjects, id) => gameObjects.filter(
      (item) => id !== item.getId(),
    );

    const gameObjectId = gameObject.getId();

    this._observedGameObjects = remove(this._observedGameObjects, gameObjectId);
    this._acceptedGameObjects = remove(this._acceptedGameObjects, gameObjectId);
    this._acceptedGameObjectsMap[gameObjectId] = void 0;

    this._removedFromAccepted.push(gameObject);
  }

  private _test(gameObject: GameObject): boolean {
    if (this._type && this._type !== gameObject.type) {
      return false;
    }

    return this._components.every((component) => {
      // Dummy check to avoid typescript error
      if (typeof component === 'string') {
        return gameObject.getComponent(component);
      }
      return gameObject.getComponent(component);
    });
  }

  private _accept(gameObject: GameObject): void {
    const gameObjectId = gameObject.getId();

    if (this._acceptedGameObjectsMap[gameObjectId]) {
      return;
    }

    this._acceptedGameObjects.push(gameObject);
    this._acceptedGameObjectsMap[gameObjectId] = gameObject;

    this._addedToAccepted.push(gameObject);
  }

  private _decline(gameObject: GameObject): void {
    const gameObjectId = gameObject.getId();

    if (!this._acceptedGameObjectsMap[gameObjectId]) {
      return;
    }

    this._acceptedGameObjects = this._acceptedGameObjects.filter(
      (acceptedGameObject) => gameObjectId !== acceptedGameObject.getId(),
    );
    this._acceptedGameObjectsMap[gameObjectId] = void 0;

    this._removedFromAccepted.push(gameObject);
  }

  size(): number {
    return this._acceptedGameObjects.length;
  }

  getById(id: string): GameObject | undefined {
    return this._acceptedGameObjectsMap[id];
  }

  getByIndex(index: number): GameObject | undefined {
    return this._acceptedGameObjects[index];
  }

  forEach(callback: (gameObject: GameObject, index: number) => void): void {
    this._acceptedGameObjects.forEach(callback);
  }

  map(callback: (gameObject: GameObject, index: number) => unknown): Array<unknown> {
    return this._acceptedGameObjects.map(callback);
  }

  sort(compareFunction: (a: GameObject, b: GameObject) => number): void {
    this._acceptedGameObjects = this._acceptedGameObjects.sort(compareFunction);
  }

  getList(): Array<GameObject> {
    return this._acceptedGameObjects;
  }

  subscribe<K extends keyof ObserverEventMap>(
    type: K,
    callback: (event: ObserverEventMap[K]) => void,
  ): void {
    if (!this.subscriptions[type]) {
      return;
    }

    this.subscriptions[type].push(callback);
  }

  unsubscribe<K extends keyof ObserverEventMap>(
    type: K,
    callback: (event: ObserverEventMap[K]) => void,
  ): void {
    if (!this.subscriptions[type]) {
      return;
    }

    this.subscriptions[type] = this.subscriptions[type].filter(
      (currentCallback: (gameObject: GameObject) => void) => callback !== currentCallback,
    );
  }

  fireEvents(): void {
    this.subscriptions.onremove.forEach((callback: (gameObject: GameObject) => void) => {
      this._removedFromAccepted.forEach((gameObject: GameObject) => callback(gameObject));
    });
    this._removedFromAccepted = [];

    this.subscriptions.onadd.forEach((callback: (gameObject: GameObject) => void) => {
      this._addedToAccepted.forEach((gameObject: GameObject) => callback(gameObject));
    });
    this._addedToAccepted = [];
  }
}
