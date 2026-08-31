import type { Actor } from 'dacha';

import type { DebugViewModule } from './types';

interface DebugVisualizerAPIOptions {
  debugActorMap: Map<DebugViewModule, Map<Actor, Actor | null>>;
}

export class DebugVisualizerAPI {
  private debugActorMap: Map<DebugViewModule, Map<Actor, Actor | null>>;

  constructor({ debugActorMap }: DebugVisualizerAPIOptions) {
    this.debugActorMap = debugActorMap;
  }

  getDebugActors(actor: Actor): Actor[] {
    const debugActors = new Set<Actor>();

    this.debugActorMap.forEach((moduleActorMap) => {
      const debugActor = moduleActorMap.get(actor);
      if (debugActor) {
        debugActors.add(debugActor);
      }
    });

    return Array.from(debugActors);
  }
}
