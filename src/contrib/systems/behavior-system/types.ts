import type {
  Actor,
  ActorSpawner,
} from '../../../engine/actor';
import type { World } from '../../../engine/world';
import type { Scene } from '../../../engine/scene';
import type { Constructor } from '../../../types/utils';

export interface BehaviorOptions {
  world: World
  scene: Scene
  actor: Actor
  actorSpawner: ActorSpawner
  globalOptions: Record<string, unknown>
}

interface UpdateOptions {
  deltaTime: number
}

export abstract class Behavior {
  static behaviorName: string;
  destroy?(): void;
  update?(options: UpdateOptions): void;
}

export type BehaviorConstructor = Constructor<Behavior> & { behaviorName: string };
