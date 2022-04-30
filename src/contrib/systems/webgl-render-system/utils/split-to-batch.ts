import type { GameObject } from '../../../../engine/game-object';
import type { ShaderProvider } from '../shader-builder';

interface BatchSplitterAcc {
  batches: Array<Array<GameObject>>
  prevShadingId?: string
}

export const splitToBatch = (
  gameObjects: Array<GameObject>,
  shaderProvider: ShaderProvider,
): Array<Array<GameObject>> => {
  if (!gameObjects.length) {
    return [];
  }

  const { batches } = gameObjects.reduce((acc: BatchSplitterAcc, gameObject) => {
    const shadingId = shaderProvider.getShadingId(gameObject.getId());

    const currentBatch = acc.batches[acc.batches.length - 1];

    if (shadingId === acc.prevShadingId) {
      currentBatch.push(gameObject);
    } else {
      acc.batches.push([gameObject]);
      acc.prevShadingId = shadingId;
    }

    return acc;
  }, { batches: [[]], prevShadingId: shaderProvider.getShadingId(gameObjects[0].getId()) });

  return batches;
};
