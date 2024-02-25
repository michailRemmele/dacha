import type { ActorCreator } from './actor-creator';
import type { Actor } from './actor';

export class ActorSpawner {
  private actorCreator: ActorCreator;

  constructor(actorCreator: ActorCreator) {
    this.actorCreator = actorCreator;
  }

  spawn(templateId: string): Actor {
    return this.actorCreator.create({
      templateId,
      fromTemplate: true,
      isNew: true,
    });
  }
}
