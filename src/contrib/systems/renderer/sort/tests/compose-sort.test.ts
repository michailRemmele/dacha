import { Transform, TransformConfig } from '../../../../components/transform';
import { Actor } from '../../../../../engine/actor/actor';

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

  const sortY = (a: Actor, b: Actor): number => (
    (a.getComponent(Transform)).offsetY - (b.getComponent(Transform)).offsetY
  );
  const sortX = (a: Actor, b: Actor): number => (
    (a.getComponent(Transform)).offsetX - (b.getComponent(Transform)).offsetX
  );
  const sortZ = (a: Actor, b: Actor): number => (
    (a.getComponent(Transform)).offsetZ - (b.getComponent(Transform)).offsetZ
  );

  it('Correctly creates composed sort function which executes passing function in correct order', () => {
    const actor1 = new Actor({ id: '1', name: 'mock-actor-1' });
    const actor2 = new Actor({ id: '2', name: 'mock-actor-2' });

    actor1.setComponent(new Transform(baseTransformProps));
    actor2.setComponent(new Transform(baseTransformProps));

    (actor1.getComponent(Transform)).offsetY = 10;
    (actor1.getComponent(Transform)).offsetX = 20;
    (actor1.getComponent(Transform)).offsetZ = 40;

    (actor2.getComponent(Transform)).offsetY = 10;
    (actor2.getComponent(Transform)).offsetX = 20;
    (actor2.getComponent(Transform)).offsetZ = 30;

    expect(composeSort([sortY, sortX, sortZ])(actor1, actor2)).toBeGreaterThan(0);

    (actor2.getComponent(Transform)).offsetX = 30;

    expect(composeSort([sortY, sortX, sortZ])(actor1, actor2)).toBeLessThan(0);

    (actor1.getComponent(Transform)).offsetY = 20;

    expect(composeSort([sortY, sortX, sortZ])(actor1, actor2)).toBeGreaterThan(0);
  });
});
