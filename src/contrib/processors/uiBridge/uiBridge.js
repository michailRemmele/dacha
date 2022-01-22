import Observer from './observer/observer';
import MapObserver from './observer/mapObserver';

class UiBridge {
  constructor(options) {
    const {
      onInit,
      onDestroy,
      sceneController,
      gameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
      messageBus,
    } = options;

    this._onUiInit = onInit;
    this._onUiDestroy = onDestroy;
    this._sceneController = sceneController;
    this._gameObjectObserver = gameObjectObserver;
    this._gameObjectSpawner = gameObjectSpawner;
    this._gameObjectDestroyer = gameObjectDestroyer;
    this._store = store;
    this.messageBus = messageBus;

    this._messageBusObserver = new Observer();
    this._storeObserver = new Observer();
    this._gameObjects = new MapObserver();

    this._messageQueue = [];
    this._actionsQueue = [];
  }

  processorDidMount() {
    this._onUiInit({
      sceneName: this._sceneController.getCurrentName(),
      messageBusObserver: this._messageBusObserver,
      storeObserver: this._storeObserver,
      pushMessage: this._pushMessage.bind(this),
      pushAction: this._pushAction.bind(this),
      gameObjects: this._gameObjects,
    });
    this._gameObjectObserver.subscribe('onremove', this._handleGameObjectRemove);
  }

  processorWillUnmount() {
    this._onUiDestroy();
    this._gameObjectObserver.unsubscribe('onremove', this._handleGameObjectRemove);
  }

  _handleGameObjectRemove = (gameObject) => {
    this._gameObjects.next(null, gameObject.getId());
  };

  _pushAction(action) {
    this._actionsQueue.push(action);
  }

  _pushMessage(message) {
    this._messageQueue.push(message);
  }

  process(options) {
    const { deltaTime } = options;

    this._gameObjectObserver.fireEvents();

    this._gameObjectObserver.forEach((gameObject) => {
      this._gameObjects.next(gameObject, gameObject.getId());
    });

    this._messageBusObserver.next(this.messageBus);
    this._storeObserver.next(this._store);

    this._messageQueue.forEach((message) => {
      this.messageBus.send(message, true);
    });

    this._messageQueue = [];

    this._actionsQueue.forEach((action) => {
      action({
        messageBus: this.messageBus,
        deltaTime,
        store: this._store,
        gameObjectSpawner: this._gameObjectSpawner,
        gameObjectDestroyer: this._gameObjectDestroyer,
      });
    });

    this._actionsQueue = [];
  }
}

export default UiBridge;
