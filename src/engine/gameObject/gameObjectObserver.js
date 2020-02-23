class GameObjectObserver {
  constructor(scene, filter) {
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
      const gameObject = event.gameObject;

      if (scene.GAME_OBJECT_ADDED === event.type) {
        gameObject.subscribe(this._subscribeGameObject.bind(this));
        this._add(gameObject);
      } else {
        this._remove(gameObject);
      }
    });
  }

  _subscribeGameObject(event) {
    const gameObject = event.gameObject;

    if (this._test(gameObject)) {
      this._accept(gameObject);
    } else {
      this._decline(gameObject);
    }
  }

  _add(gameObject) {
    this._observedGameObjects.push(gameObject);

    if (this._test(gameObject)) {
      this._accept(gameObject);
    }
  }

  _remove(gameObject) {
    const remove = (gameObjects) => {
      return gameObjects.filter((gameObject) => {
        return gameObjectId !== gameObject.getId();
      });
    };

    const gameObjectId = gameObject.getId();

    this._observedGameObjects = remove(this._observedGameObjects, gameObject);
    this._acceptedGameObjects = remove(this._acceptedGameObjects, gameObject);
    this._acceptedGameObjectsMap[gameObjectId] = undefined;

    this._removedFromAccepted.push(gameObject);
  }

  _test(gameObject) {
    const type = gameObject.getType();

    if (this._type && this._type !== type) {
      return false;
    }

    return this._components.every((component) => {
      return gameObject.getComponent(component);
    });
  }

  _accept(gameObject) {
    const gameObjectId = gameObject.getId();

    if (this._acceptedGameObjectsMap[gameObjectId]) {
      return;
    }

    this._acceptedGameObjects.push(gameObject);
    this._acceptedGameObjectsMap[gameObjectId] = gameObject;

    this._addedToAccepted.push(gameObject);
  }

  _decline(gameObject) {
    const gameObjectId = gameObject.getId();

    if (!this._acceptedGameObjectsMap[gameObjectId]) {
      return;
    }

    this._acceptedGameObjects = this._acceptedGameObjects.filter((acceptedGameObject) => {
      return gameObjectId !== acceptedGameObject.getId();
    });
    this._acceptedGameObjectsMap[gameObjectId] = undefined;

    this._removedFromAccepted.push(gameObject);
  }

  size() {
    return this._acceptedGameObjects.length;
  }

  getLastRemoved() {
    const lastRemoved = this._removedFromAccepted;
    this._removedFromAccepted = [];

    return lastRemoved;
  }

  getLastAdded() {
    const lastAdded = this._addedToAccepted;
    this._addedToAccepted = [];

    return lastAdded;
  }

  getById(id) {
    return this._acceptedGameObjectsMap[id];
  }

  getByIndex(index) {
    return this._acceptedGameObjects[index];
  }

  forEach(callback) {
    this._acceptedGameObjects.forEach(callback);
  }

  map(callback) {
    return this._acceptedGameObjects.map(callback);
  }

  sort(compareFunction) {
    this._acceptedGameObjects = this._acceptedGameObjects.sort(compareFunction);
  }
}

export default GameObjectObserver;
