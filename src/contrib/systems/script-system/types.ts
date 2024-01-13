import type {
  GameObject,
  GameObjectObserver,
  GameObjectSpawner,
  GameObjectDestroyer,
} from '../../../engine/game-object';
import type { Scene } from '../../../engine/scene';

export interface GameObjectScriptOptions {
  scene: Scene
  gameObject: GameObject
  gameObjectObserver: GameObjectObserver
  gameObjectSpawner: GameObjectSpawner
  gameObjectDestroyer: GameObjectDestroyer
}

interface UpdateOptions {
  deltaTime: number
}

export interface GameObjectScript {
  destroy?(): void
  update?(options: UpdateOptions): void
}
