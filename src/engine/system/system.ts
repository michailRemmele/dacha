import type { ActorSpawner } from '../actor';
import type { TemplateCollection } from '../template';
import type { Scene } from '../scene';
import type { Constructor } from '../../types/utils';

export interface SystemOptions extends Record<string, unknown> {
  actorSpawner: ActorSpawner
  resources?: unknown
  globalOptions: Record<string, unknown>
  scene: Scene
  templateCollection: TemplateCollection
}

export interface UpdateOptions {
  deltaTime: number;
}

export abstract class System {
  static systemName: string;
  load?(): Promise<void>;
  mount?(): void;
  unmount?(): void;
  update?(options: UpdateOptions): void;
  fixedUpdate?(options: UpdateOptions): void;
}

export type SystemConstructor = Constructor<System> & { systemName: string };
