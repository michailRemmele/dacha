import { GAME_OBJECT_CREATOR_KEY_NAME } from '../consts/global';
import { System } from '../system';
import IOC from '../ioc/ioc';
import { GameObjectObserver, GameObjectObserverFilter, GameObject } from '../gameObject';
import GameObjectSpawner from '../gameObject/gameObjectSpawner';
import GameObjectDestroyer from '../gameObject/gameObjectDestroyer';
import { MessageBus } from '../message-bus';

import { Store } from './store';
import { GAME_OBJECT_ADDED, GAME_OBJECT_REMOVED } from './consts';

// TODO: Remove once game object creator will be moved to ts
interface GameObjectCreator {
  create(options: unknown): Array<GameObject>;
}

export interface SceneOptions {
  name: string;
  gameObjects: Array<unknown>;
}

export interface GameObjectChangeEvent {
  type: string;
  gameObject: GameObject;
}

export class Scene {
  private _name: string;
  private _gameObjects: Record<string, GameObject>;
  private _store: Store;
  private _gameObjectCreator: GameObjectCreator;
  private _gameObjectSpawner: unknown;
  private _gameObjectDestroyer: unknown;
  private messageBus: MessageBus;
  private _systems: Array<System>;
  private _gameObjectsChangeSubscribers: Array<(event: GameObjectChangeEvent) => void>;

  constructor(options: SceneOptions) {
    const { name, gameObjects } = options;

    this._name = name;
    this._gameObjects = {};
    this._store = new Store();
    this._gameObjectCreator = IOC.resolve(GAME_OBJECT_CREATOR_KEY_NAME) as GameObjectCreator;
    this._gameObjectSpawner = new GameObjectSpawner(this, this._gameObjectCreator);
    this._gameObjectDestroyer = new GameObjectDestroyer(this);
    this.messageBus = new MessageBus();

    this._systems = [];

    this._gameObjectsChangeSubscribers = [];

    gameObjects.forEach((gameObjectOptions) => {
      this._gameObjectCreator.create(gameObjectOptions).forEach((gameObject: GameObject) => {
        this.addGameObject(gameObject);
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

  createGameObjectObserver(filter: GameObjectObserverFilter) {
    return new GameObjectObserver(this, filter);
  }

  getGameObjectSpawner() {
    return this._gameObjectSpawner;
  }

  getGameObjectDestroyer() {
    return this._gameObjectDestroyer;
  }

  getMessageBus() {
    return this.messageBus;
  }

  addGameObject(gameObject: GameObject) {
    const id = gameObject.getId();

    if (this._gameObjects[id]) {
      throw new Error(`The game object with same id already exists: ${id}`);
    }

    this._gameObjects[id] = gameObject;

    this._gameObjectsChangeSubscribers.forEach((callback) => {
      callback({
        type: GAME_OBJECT_ADDED,
        gameObject,
      });
    });
  }

  removeGameObject(gameObject: GameObject) {
    gameObject.clearSubscriptions();
    this._gameObjects = Object.keys(this._gameObjects)
      .reduce((acc: Record<string, GameObject>, key) => {
        if (key !== gameObject.getId()) {
          acc[key] = this._gameObjects[key];
        }

        return acc;
      }, {});

    this._gameObjectsChangeSubscribers.forEach((callback) => {
      callback({
        type: GAME_OBJECT_REMOVED,
        gameObject,
      });
    });
  }

  getName() {
    return this._name;
  }

  getGameObjects() {
    return Object.values(this._gameObjects);
  }

  subscribeOnGameObjectsChange(callback: (event: GameObjectChangeEvent) => void) {
    if (!(callback instanceof Function)) {
      throw new Error('On subscribe callback should be a function');
    }

    this._gameObjectsChangeSubscribers.push(callback);
  }
}
