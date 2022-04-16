import type { Entity } from '../../../../engine/entity';
import type { ShaderProvider } from '../shader-builder';

interface BatchSplitterAcc {
  batches: Array<Array<Entity>>
  prevShadingId?: string
}

export const splitToBatch = (
  entities: Array<Entity>,
  shaderProvider: ShaderProvider,
): Array<Array<Entity>> => {
  if (!entities.length) {
    return [];
  }

  const { batches } = entities.reduce((acc: BatchSplitterAcc, entity) => {
    const shadingId = shaderProvider.getShadingId(entity.getId());

    const currentBatch = acc.batches[acc.batches.length - 1];

    if (shadingId === acc.prevShadingId) {
      currentBatch.push(entity);
    } else {
      acc.batches.push([entity]);
      acc.prevShadingId = shadingId;
    }

    return acc;
  }, { batches: [[]], prevShadingId: shaderProvider.getShadingId(entities[0].getId()) });

  return batches;
};
