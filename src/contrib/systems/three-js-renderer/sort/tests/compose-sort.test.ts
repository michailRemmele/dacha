import { Transform, TransformConfig } from '../../../../components/transform';
import { GameObject } from '../../../../../engine/game-object/game-object';

import { composeSort } from '../index';

describe('Contrib -> RenderSystem -> Sort -> composeSort()', () => {
  const baseTransformProps: TransformConfig = {
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  };

  const sortY = (a: GameObject, b: GameObject): number => (
    (a.getComponent(Transform)).offsetY - (b.getComponent(Transform)).offsetY
  );
  const sortX = (a: GameObject, b: GameObject): number => (
    (a.getComponent(Transform)).offsetX - (b.getComponent(Transform)).offsetX
  );
  const sortZ = (a: GameObject, b: GameObject): number => (
    (a.getComponent(Transform)).offsetZ - (b.getComponent(Transform)).offsetZ
  );

  it('Correctly creates composed sort function which executes passing function in correct order', () => {
    const gameObject1 = new GameObject({ id: '1', name: 'mock-game-object-1' });
    const gameObject2 = new GameObject({ id: '2', name: 'mock-game-object-2' });

    gameObject1.setComponent(new Transform(baseTransformProps));
    gameObject2.setComponent(new Transform(baseTransformProps));

    (gameObject1.getComponent(Transform)).offsetY = 10;
    (gameObject1.getComponent(Transform)).offsetX = 20;
    (gameObject1.getComponent(Transform)).offsetZ = 40;

    (gameObject2.getComponent(Transform)).offsetY = 10;
    (gameObject2.getComponent(Transform)).offsetX = 20;
    (gameObject2.getComponent(Transform)).offsetZ = 30;

    expect(composeSort([sortY, sortX, sortZ])(gameObject1, gameObject2)).toBeGreaterThan(0);

    (gameObject2.getComponent(Transform)).offsetX = 30;

    expect(composeSort([sortY, sortX, sortZ])(gameObject1, gameObject2)).toBeLessThan(0);

    (gameObject1.getComponent(Transform)).offsetY = 20;

    expect(composeSort([sortY, sortX, sortZ])(gameObject1, gameObject2)).toBeGreaterThan(0);
  });
});
