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

  const sortY = (a: GameObject, b: GameObject) => (
    (a.getComponent('transform') as Transform).offsetY - (b.getComponent('transform') as Transform).offsetY
  );
  const sortX = (a: GameObject, b: GameObject) => (
    (a.getComponent('transform') as Transform).offsetX - (b.getComponent('transform') as Transform).offsetX
  );
  const sortZ = (a: GameObject, b: GameObject) => (
    (a.getComponent('transform') as Transform).offsetZ - (b.getComponent('transform') as Transform).offsetZ
  );

  it('Correctly creates composed sort function which executes passing function in correct order', () => {
    const gameObject1 = new GameObject({ id: '1', name: 'mock-gameObject-1' });
    const gameObject2 = new GameObject({ id: '2', name: 'mock-gameObject-2' });

    gameObject1.setComponent('transform', new Transform('transform', baseTransformProps));
    gameObject2.setComponent('transform', new Transform('transform', baseTransformProps));

    (gameObject1.getComponent('transform') as Transform).offsetY = 10;
    (gameObject1.getComponent('transform') as Transform).offsetX = 20;
    (gameObject1.getComponent('transform') as Transform).offsetZ = 40;

    (gameObject2.getComponent('transform') as Transform).offsetY = 10;
    (gameObject2.getComponent('transform') as Transform).offsetX = 20;
    (gameObject2.getComponent('transform') as Transform).offsetZ = 30;

    expect(composeSort([sortY, sortX, sortZ])(gameObject1, gameObject2)).toBeGreaterThan(0);

    (gameObject2.getComponent('transform') as Transform).offsetX = 30;

    expect(composeSort([sortY, sortX, sortZ])(gameObject1, gameObject2)).toBeLessThan(0);

    (gameObject1.getComponent('transform') as Transform).offsetY = 20;

    expect(composeSort([sortY, sortX, sortZ])(gameObject1, gameObject2)).toBeGreaterThan(0);
  });
});
