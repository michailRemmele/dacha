import { EventTarget } from '../event-target';
import type { EventType, Event, ListenerFn } from '../event-target';
import {
  AddComponent,
  RemoveComponent,
  AddGameObject,
  RemoveGameObject,
  AddChildObject,
  RemoveChildObject,
} from '../events';
import type {
  AddComponentEvent,
  RemoveComponentEvent,
  GameObjectObserverEventMap,
} from '../events';
import type { Scene } from '../scene';
import type { ComponentConstructor } from '../component';
import { traverseObject } from '../base-object';

import { GameObject } from './game-object';

type GameObjectObserverListenerFn<T extends EventType> = (
  event: T extends keyof GameObjectObserverEventMap ? GameObjectObserverEventMap[T] : Event
) => void;

export interface GameObjectObserverFilter {
  components?: Array<ComponentConstructor | string>;
}

export class GameObjectObserver extends EventTarget {
  private components: Array<ComponentConstructor | string>;
  private acceptedGameObjects: Array<GameObject>;
  private acceptedGameObjectsMap: Record<string, GameObject | undefined>;

  constructor(scene: Scene, filter: GameObjectObserverFilter = {}) {
    super();

    const {
      components = [],
    } = filter;

    this.components = components;

    this.acceptedGameObjectsMap = {};
    this.acceptedGameObjects = [];

    traverseObject<Scene | GameObject>(scene, (object) => {
      if (object instanceof GameObject && this.test(object)) {
        this.acceptedGameObjectsMap[object.id] = object;
        this.acceptedGameObjects.push(object);
      }
    });

    scene.addEventListener(AddChildObject, (event) => {
      traverseObject(event.child, (object) => this.add(object as GameObject));
    });
    scene.addEventListener(RemoveChildObject, (event) => {
      traverseObject(event.child, (object) => this.remove(object as GameObject));
    });
    scene.addEventListener(AddComponent, this.handleGameObjectUpdate);
    scene.addEventListener(RemoveComponent, this.handleGameObjectUpdate);
  }

  override addEventListener<T extends EventType>(
    type: T,
    callback: GameObjectObserverListenerFn<T>,
  ): void {
    super.addEventListener(type, callback as ListenerFn);
  }

  override removeEventListener<T extends EventType>(
    type: T,
    callback: GameObjectObserverListenerFn<T>,
  ): void {
    super.removeEventListener(type, callback as ListenerFn);
  }

  private handleGameObjectUpdate = (event: AddComponentEvent | RemoveComponentEvent): void => {
    const { target } = event;

    if (this.test(target)) {
      this.accept(target);
    } else {
      this.decline(target);
    }
  };

  private add(gameObject: GameObject): void {
    if (this.test(gameObject)) {
      this.accept(gameObject);
    }
  }

  private remove(gameObject: GameObject): void {
    if (!this.acceptedGameObjectsMap[gameObject.id]) {
      return;
    }

    this.acceptedGameObjects = this.acceptedGameObjects.filter(
      (acceptedGameObject) => gameObject.id !== acceptedGameObject.id,
    );
    delete this.acceptedGameObjectsMap[gameObject.id];

    this.emit(RemoveGameObject, { gameObject });
  }

  private test(gameObject: GameObject): boolean {
    return this.components.every((component) => {
      // Dummy check to avoid typescript error
      if (typeof component === 'string') {
        return gameObject.getComponent(component);
      }
      return gameObject.getComponent(component);
    });
  }

  private accept(gameObject: GameObject): void {
    if (this.acceptedGameObjectsMap[gameObject.id]) {
      return;
    }

    this.acceptedGameObjects.push(gameObject);
    this.acceptedGameObjectsMap[gameObject.id] = gameObject;

    this.emit(AddGameObject, { gameObject });
  }

  private decline(gameObject: GameObject): void {
    if (!this.acceptedGameObjectsMap[gameObject.id]) {
      return;
    }

    this.acceptedGameObjects = this.acceptedGameObjects.filter(
      (acceptedGameObject) => gameObject.id !== acceptedGameObject.id,
    );
    delete this.acceptedGameObjectsMap[gameObject.id];

    this.emit(RemoveGameObject, { gameObject });
  }

  get size(): number {
    return this.acceptedGameObjects.length;
  }

  getById(id: string): GameObject | undefined {
    return this.acceptedGameObjectsMap[id];
  }

  forEach(callback: (gameObject: GameObject, index: number) => void): void {
    this.acceptedGameObjects.forEach(callback);
  }

  sort(compareFunction: (a: GameObject, b: GameObject) => number): void {
    this.acceptedGameObjects.sort(compareFunction);
  }
}
