import { EventEmitter } from '../event-emitter';
import {
  AddComponent,
  RemoveComponent,
  AddGameObject,
  RemoveGameObject,
} from '../events';
import type { UpdateComponentEvent, GameObjectObserverEventMap } from '../events';
import type { Scene } from '../scene';
import type { ComponentConstructor } from '../component';

import type { GameObject } from './game-object';

type GetObjectsToRemoveFn = (gameObjects: Array<GameObject>, id: string) => Array<GameObject>;

export interface GameObjectObserverFilter {
  components?: Array<ComponentConstructor | string>;
}

export class GameObjectObserver extends EventEmitter<GameObjectObserverEventMap> {
  private _components: Array<ComponentConstructor | string>;
  private _observedGameObjects: Array<GameObject>;
  private _acceptedGameObjects: Array<GameObject>;
  private _acceptedGameObjectsMap: Record<string, GameObject | undefined>;

  constructor(scene: Scene, filter: GameObjectObserverFilter = {}) {
    super();

    const {
      components = [],
    } = filter;

    this._components = components;
    this._observedGameObjects = scene.getGameObjects();
    this._acceptedGameObjectsMap = {};
    this._acceptedGameObjects = this._observedGameObjects.filter((gameObject) => {
      gameObject.addEventListener(AddComponent, this.handleGameObjectUpdate);
      gameObject.addEventListener(RemoveComponent, this.handleGameObjectUpdate);

      if (!this._test(gameObject)) {
        return false;
      }

      this._acceptedGameObjectsMap[gameObject.getId()] = gameObject;

      return true;
    });

    scene.addEventListener(AddGameObject, (event) => {
      const { gameObject } = event;
      gameObject.addEventListener(AddComponent, this.handleGameObjectUpdate);
      gameObject.addEventListener(RemoveComponent, this.handleGameObjectUpdate);
      this._add(gameObject);
    });
    scene.addEventListener(RemoveGameObject, (event) => {
      const { gameObject } = event;
      this._remove(gameObject);
    });
  }

  private handleGameObjectUpdate = (event: UpdateComponentEvent): void => {
    const { target } = event;

    if (this._test(target)) {
      this._accept(target);
    } else {
      this._decline(target);
    }
  };

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

    this.emit(RemoveGameObject, { gameObject });
  }

  private _test(gameObject: GameObject): boolean {
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

    this.emit(AddGameObject, { gameObject });
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

    this.emit(RemoveGameObject, { gameObject });
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
}
