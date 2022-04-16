export class EntitySpawner {
  constructor(scene, entityCreator) {
    this._scene = scene;
    this._entityCreator = entityCreator;
  }

  spawn(name) {
    const entities = this._entityCreator.create({
      prefabName: name,
      fromPrefab: true,
      isNew: true,
    });

    entities.forEach((entity) => {
      this._scene.addEntity(entity);
    });

    return entities[0];
  }
}
