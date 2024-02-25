import type { GameObjectCreator } from './game-object-creator';
import type { GameObject } from './game-object';

export class GameObjectSpawner {
  private gameObjectCreator: GameObjectCreator;

  constructor(gameObjectCreator: GameObjectCreator) {
    this.gameObjectCreator = gameObjectCreator;
  }

  spawn(templateId: string): GameObject {
    return this.gameObjectCreator.create({
      templateId,
      fromTemplate: true,
      isNew: true,
    });
  }
}
