import { AddActor, RemoveActor } from '../../../../engine/events';
import type { AddActorEvent, RemoveActorEvent } from '../../../../engine/events';
import type {
  ActorCollection,
  Actor,
} from '../../../../engine/actor';
import { Renderable } from '../../../components/renderable';

export class ShaderProvider {
  private actorCollection: ActorCollection;
  private shadingIdMap: Record<string, string>;

  constructor(actorCollection: ActorCollection) {
    this.actorCollection = actorCollection;

    this.shadingIdMap = {};

    // TODO: Remove listeners on system unmount
    this.actorCollection.addEventListener(AddActor, this.handleActorAdd);
    this.actorCollection.addEventListener(RemoveActor, this.handleActorRemove);
  }

  getShadingId(actorId: string): string {
    return this.shadingIdMap[actorId];
  }

  private handleActorAdd = (event: AddActorEvent): void => {
    const { actor } = event;
    this.shadingIdMap[actor.id] = this.calculateShadingId(actor);
  };

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;
    this.shadingIdMap = Object.keys(this.shadingIdMap)
      .reduce((acc: Record<string, string>, key) => {
        if (key !== actor.id) {
          acc[key] = this.shadingIdMap[key];
        }

        return acc;
      }, {});
  };

  private calculateShadingId(actor: Actor): string {
    const renderable = actor.getComponent(Renderable);

    return `${renderable.fit}`;
  }
}
