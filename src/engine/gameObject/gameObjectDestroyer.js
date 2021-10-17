class GameObjectDestroyer {
  constructor(scene) {
    this._scene = scene;
  }

  _deleteFromScene(gameObject) {
    this._scene.removeGameObject(gameObject);

    gameObject.getChildren().forEach((child) => {
      this._deleteFromScene(child);
    });
  }

  destroy(gameObject) {
    if (gameObject.parent) {
      gameObject.parent.removeChild(gameObject);
    }

    this._deleteFromScene(gameObject);
  }
}

export default GameObjectDestroyer;
