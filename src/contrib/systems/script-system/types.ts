import type {
  GameObject,
  GameObjectSpawner,
} from '../../../engine/game-object';
import type { Scene } from '../../../engine/scene';
import type { Constructor } from '../../../types/utils';

export interface ScriptOptions {
  scene: Scene
  gameObject: GameObject
  gameObjectSpawner: GameObjectSpawner
}

interface UpdateOptions {
  deltaTime: number
}

export abstract class Script {
  static scriptName: string;
  destroy?(): void;
  update?(options: UpdateOptions): void;
}

export type ScriptConstructor = Constructor<Script> & { scriptName: string };
