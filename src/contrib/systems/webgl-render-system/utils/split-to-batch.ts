import type { Actor, ActorCollection } from '../../../../engine/actor';
import type { ShaderProvider } from '../shader-builder';

export const splitToBatch = (
  actorCollection: ActorCollection,
  shaderProvider: ShaderProvider,
): Array<Array<Actor>> => {
  if (!actorCollection.size) {
    return [];
  }

  const batches: Array<Array<Actor>> = [];
  let prevShadingId: string;

  actorCollection.forEach((actor) => {
    const shadingId = shaderProvider.getShadingId(actor.id);

    const currentBatch = batches[batches.length - 1];

    if (shadingId === prevShadingId) {
      currentBatch.push(actor);
    } else {
      batches.push([actor]);
      prevShadingId = shadingId;
    }
  });

  return batches;
};
