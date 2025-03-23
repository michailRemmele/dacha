import type {
  Actor,
  ActorSpawner,
} from '../../../engine/actor';
import type { Scene } from '../../../engine/scene';
import type { Constructor } from '../../../types/utils';

export interface ScriptOptions {
  scene: Scene
  actor: Actor
  actorSpawner: ActorSpawner
  globalOptions: Record<string, unknown>
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
