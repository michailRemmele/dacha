class GameObjectObserver {
  constructor(scene, components) {
    this._components = components;
    this._observedGameObjects = scene.getGameObjects();
    this._acceptedGameObjects = this._observedGameObjects.filter((gameObject) => {
      gameObject.subscribe((event) => {
        const gameObject = event.gameObject;

        if (this._test(gameObject)) {
          this._accept(gameObject);
        } else {
          this._decline(gameObject);
        }
      });

      return this._test(gameObject);
    });

    this._acceptedGameObjectsMap = this._acceptedGameObjects.reduce((storage, gameObject) => {
      storage[gameObject.getId()] = gameObject;

      return storage;
    }, {});

    scene.subscribeOnGameObjectsChange((event) => {
      const gameObject = event.gameObject;

      if (scene.GAME_OBJECT_ADDED === event.type) {
        this._add(gameObject);
      } else {
        this._remove(gameObject);
      }
    });
  }

  _add(gameObjects, gameObject) {
    this._observedGameObjects.push(gameObject);

    if (this._test(gameObject)) {
      this._accept(gameObject);
    }
  }

  _remove(gameObjects, gameObject) {
    const remove = (gameObjects) => {
      return gameObjects.filter((gameObject) => {
        return gameObjectId !== gameObject.getId();
      });
    };

    const gameObjectId = gameObject.getId();

    this._observedGameObjects = remove(this._observedGameObjects, gameObject);
    this._acceptedGameObjects = remove(this._acceptedGameObjects, gameObject);
    this._acceptedGameObjectsMap[gameObjectId] = undefined;
  }

  _test(gameObject) {
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
