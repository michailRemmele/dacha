import Processor from 'engine/processor/processor';

import Observer from './observer/observer';
import MapObserver from './observer/mapObserver';

class UiBridge extends Processor {
  constructor(options) {
    super();

    const { onInit, onDestroy, sceneController, gameObjectObserver } = options;

    this._onUiInit = onInit;
    this._onUiDestroy = onDestroy;
    this._sceneController = sceneController;
    this._gameObjectObserver = gameObjectObserver;
    this._messageBusObserver = new Observer();
    this._gameObjects = new MapObserver();

    this._messageQueue = [];
  }

  processorDidMount() {
    this._onUiInit({
      sceneName: this._sceneController.getCurrentName(),
      messageBusObserver: this._messageBusObserver,
      pushMessage: this._pushMessage.bind(this),
      gameObjects: this._gameObjects,
    });
  }

  processorWillUnmount() {
    this._onUiDestroy();
  }

  _pushMessage(message) {
    this._messageQueue.push(message);
  }

  _processRemovedGameObjects() {
    this._gameObjectObserver.getLastRemoved().forEach((gameObject) => {
      this._gameObjects.next(null, gameObject.getId());
    });
  }

  process(options) {
    const { messageBus } = options;

    this._processRemovedGameObjects();

    this._gameObjectObserver.forEach((gameObject) => {
      this._gameObjects.next(gameObject, gameObject.getId());
    });

    this._messageBusObserver.next(messageBus);

    this._messageQueue.forEach((message) => {
      messageBus.send(message, true);
    });

    this._messageQueue = [];
  }
}

export default UiBridge;
