import type { GameObject } from './game-object';
import type { Scene } from '../scene';

export class GameObjectDestroyer {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  private deleteFromScene(gameObject: GameObject): void {
    this.scene.removeGameObject(gameObject);

    gameObject.getChildren().forEach((child) => {
      this.deleteFromScene(child);
    });
  }

  destroy(gameObject: GameObject): void {
    if (gameObject.parent) {
      gameObject.parent.removeChild(gameObject);
    }

    this.deleteFromScene(gameObject);
  }
}
