import { Transform, TransformConfig } from '../../../../components/transform';
import { Actor } from '../../../../../engine/actor/actor';

import { sortByZAxis } from '../sort-by-z-axis';

describe('Contrib -> RenderSystem -> Sort -> sortByZAxis()', () => {
  const baseTransformProps: TransformConfig = {
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  };

  it('Returns correct order of objects', () => {
    const actor1 = new Actor({ id: '1', name: 'mock-actor-1' });
    const actor2 = new Actor({ id: '2', name: 'mock-actor-2' });

    actor1.setComponent(new Transform(baseTransformProps));
    actor2.setComponent(new Transform(baseTransformProps));

    expect(sortByZAxis(actor1, actor2)).toBe(0);

    (actor2.getComponent(Transform)).offsetZ = 50;

    expect(sortByZAxis(actor1, actor2)).toBeLessThan(0);

    (actor1.getComponent(Transform)).offsetZ = 100;

    expect(sortByZAxis(actor1, actor2)).toBeGreaterThan(0);
  });
});
