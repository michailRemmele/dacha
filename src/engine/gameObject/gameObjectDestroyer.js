class GameObjectDestroyer {
  constructor(scene) {
    this._scene = scene;
  }

  destroy(gameObject) {
    gameObject.getChildren().forEach((children) => {
      this._scene.removeGameObject(children);
    });

    this._scene.removeGameObject(gameObject);
  }
}

export default GameObjectDestroyer;
