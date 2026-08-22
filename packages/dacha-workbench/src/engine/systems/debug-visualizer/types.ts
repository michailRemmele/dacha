import type { Actor, SceneSystemOptions } from 'dacha';

export interface DebugViewModule {
  id: string;
  title: string;
  validate: (actor: Actor) => boolean;
  build: (actor: Actor, options: SceneSystemOptions) => Actor;
  update: (
    actor: Actor,
    debugActor: Actor,
    options: SceneSystemOptions,
  ) => void;
}

export interface DebugLayerState {
  id: string;
  title: string;
  enabled: boolean;
}
