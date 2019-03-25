import { SECTIONS } from 'engine/consts/global';

import SceneMap from './sceneMap/sceneMap';

class Scene {
  constructor(options) {
    const { name, width, height } = options;

    this._name = name;
    this._gameObjects = {};
    this._sceneMap = new SceneMap(width, height);
    this._gameObjectsCoordinates = {};

    this._processorSections = {
      [SECTIONS.EVENT_PROCESS_SECTION_NAME]: [],
      [SECTIONS.GAME_STATE_UPDATE_SECTION_NAME]: [],
      [SECTIONS.RENDERING_SECTION_NAME]: [],
    };
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

  addGameObject(gameObject) {
    const id = gameObject.getId();

    if (this._gameObjects[id]) {
      throw new Error(`The game object with same id already exists: ${id}`);
    }

    this._gameObjects[id] = gameObject;
  }

  placeGameObject(x, y, id) {
    if (this._gameObjectsCoordinates[id]) {
      const coordinates = this._gameObjectsCoordinates[id];
      this._sceneMap.removeValue(coordinates[0], coordinates[1], id);
    }

    this._sceneMap.insertValue(x, y, id);

    this._gameObjectsCoordinates[id] = [ x, y ];
  }

  forEachPlacedGameObject(callbackFn) {
    this._sceneMap.forEachValue((id, x, y) => {
      callbackFn(this._gameObjects[id], x, y);
    });
  }

  getName() {
    return this._name;
  }
}

export default Scene;
