import { SECTIONS, GAME_OBJECT_CREATOR_KEY_NAME } from '../consts/global';

import IOC from '../ioc/ioc';
import Store from './store';
import GameObjectSpawner from '../gameObject/gameObjectSpawner';
import GameObjectDestroyer from '../gameObject/gameObjectDestroyer';

const GAME_OBJECT_ADDED = 'GAME_OBJECT_ADDED';
const GAME_OBJECT_REMOVED = 'GAME_OBJECT_REMOVED';

class Scene {
  constructor(options) {
    const { name, gameObjects } = options;

    this._name = name;
    this._gameObjects = {};
    this._store = new Store();
    this._gameObjectCreator = IOC.resolve(GAME_OBJECT_CREATOR_KEY_NAME);
    this._gameObjectSpawner = new GameObjectSpawner(this, this._gameObjectCreator);
    this._gameObjectDestroyer = new GameObjectDestroyer(this);

    this._processorSections = {
      [SECTIONS.EVENT_PROCESS_SECTION_NAME]: [],
      [SECTIONS.GAME_STATE_UPDATE_SECTION_NAME]: [],
      [SECTIONS.RENDERING_SECTION_NAME]: [],
    };

    this._gameObjectsChangeSubscribers = [];

    this.GAME_OBJECT_ADDED = GAME_OBJECT_ADDED;
    this.GAME_OBJECT_REMOVED = GAME_OBJECT_REMOVED;

    gameObjects.forEach((gameObjectOptions) => {
      this._gameObjectCreator.create(gameObjectOptions).forEach((gameObject) => {
        this.addGameObject(gameObject);
      });
    });
  }

  mount() {
    Object.keys(this._processorSections).forEach((section) => {
      this._processorSections[section].forEach((processor) => {
        processor.processorDidMount();
      });
    });
  }

  unmount() {
    Object.keys(this._processorSections).forEach((section) => {
      this._processorSections[section].forEach((processor) => {
        processor.processorWillUnmount();
      });
    });
  }

  addProcessor(proccessor, section) {
    this._processorSections[section].push(proccessor);
  }

  getProcessorSection(section) {
    return this._processorSections[section];
  }

  getStore() {
    return this._store;
  }

  getGameObjectSpawner() {
    return this._gameObjectSpawner;
  }

  getGameObjectDestroyer() {
    return this._gameObjectDestroyer;
  }

  addGameObject(gameObject) {
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

  removeGameObject(gameObject) {
    gameObject.clearSubscriptions();
    this._gameObjects[gameObject.getId()] = undefined;

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

  subscribeOnGameObjectsChange(callback) {
    if (!(callback instanceof Function)) {
      throw new Error('On subscribe callback should be a function');
    }

    this._gameObjectsChangeSubscribers.push(callback);
  }
}

export default Scene;
