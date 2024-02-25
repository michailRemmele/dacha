import type { GameObject, GameObjectObserver } from '../../../../engine/game-object';
import type { ShaderProvider } from '../shader-builder';

export const splitToBatch = (
  gameObjectObserver: GameObjectObserver,
  shaderProvider: ShaderProvider,
): Array<Array<GameObject>> => {
  if (!gameObjectObserver.size) {
    return [];
  }

  const batches: Array<Array<GameObject>> = [];
  let prevShadingId: string;

  gameObjectObserver.forEach((gameObject) => {
    const shadingId = shaderProvider.getShadingId(gameObject.id);

    const currentBatch = batches[batches.length - 1];

    if (shadingId === prevShadingId) {
      currentBatch.push(gameObject);
    } else {
      batches.push([gameObject]);
      prevShadingId = shadingId;
    }
  });

  return batches;
};
