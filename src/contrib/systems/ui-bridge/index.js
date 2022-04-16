import Observer from './observer/observer';
import MapObserver from './observer/mapObserver';

export class UiBridge {
  constructor(options) {
    const {
      onInit,
      onDestroy,
      sceneController,
      entityObserver,
      entitySpawner,
      entityDestroyer,
      store,
      messageBus,
    } = options;

    this._onUiInit = onInit;
    this._onUiDestroy = onDestroy;
    this._sceneController = sceneController;
    this._entityObserver = entityObserver;
    this._entitySpawner = entitySpawner;
    this._entityDestroyer = entityDestroyer;
    this._store = store;
    this.messageBus = messageBus;

    this._messageBusObserver = new Observer();
    this._storeObserver = new Observer();
    this._entities = new MapObserver();

    this._messageQueue = [];
    this._actionsQueue = [];
  }

  systemDidMount() {
    this._onUiInit({
      sceneName: this._sceneController.getCurrentName(),
      messageBusObserver: this._messageBusObserver,
      storeObserver: this._storeObserver,
      pushMessage: this._pushMessage.bind(this),
      pushAction: this._pushAction.bind(this),
      entities: this._entities,
    });
    this._entityObserver.subscribe('onremove', this._handleEntityRemove);
  }

  systemWillUnmount() {
    this._onUiDestroy();
    this._entityObserver.unsubscribe('onremove', this._handleEntityRemove);
  }

  _handleEntityRemove = (entity) => {
    this._entities.next(null, entity.getId());
  };

  _pushAction(action) {
    this._actionsQueue.push(action);
  }

  _pushMessage(message) {
    this._messageQueue.push(message);
  }

  update(options) {
    const { deltaTime } = options;

    this._entityObserver.fireEvents();

    this._entityObserver.forEach((entity) => {
      this._entities.next(entity, entity.getId());
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
        entitySpawner: this._entitySpawner,
        entityDestroyer: this._entityDestroyer,
      });
    });

    this._actionsQueue = [];
  }
}
