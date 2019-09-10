class GameObjectSpawner {
  constructor(scene, gameObjectCreator) {
    this._scene = scene;
    this._gameObjectCreator = gameObjectCreator;
  }

  spawn(name) {
    const gameObjects = this._gameObjectCreator.create({
      prefabName: name,
      fromPrefab: true,
    });

    gameObjects.forEach((gameObject) => {
      this._scene.addGameObject(gameObject);
    });

    return gameObjects[0];
  }
}

export default GameObjectSpawner;
