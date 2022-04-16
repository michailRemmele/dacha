export class EntityDestroyer {
  constructor(scene) {
    this._scene = scene;
  }

  _deleteFromScene(entity) {
    this._scene.removeEntity(entity);

    entity.getChildren().forEach((child) => {
      this._deleteFromScene(child);
    });
  }

  destroy(entity) {
    if (entity.parent) {
      entity.parent.removeChild(entity);
    }

    this._deleteFromScene(entity);
  }
}
