import type { GameObjectCreator } from './game-object-creator';
import type { GameObject } from './game-object';
import type { Scene } from '../scene';

export class GameObjectSpawner {
  private gameObjectCreator: GameObjectCreator;
  private scene: Scene;

  constructor(scene: Scene, gameObjectCreator: GameObjectCreator) {
    this.gameObjectCreator = gameObjectCreator;
    this.scene = scene;
  }

  spawn(arg: string | GameObject): GameObject {
    let newGameObject: GameObject;

    if (typeof arg === 'string') {
      newGameObject = this.gameObjectCreator.create({
        templateName: arg,
        fromTemplate: true,
        isNew: true,
      });
    } else {
      newGameObject = arg;
    }

    this.scene.addGameObject(newGameObject);

    return newGameObject;
  }
}
