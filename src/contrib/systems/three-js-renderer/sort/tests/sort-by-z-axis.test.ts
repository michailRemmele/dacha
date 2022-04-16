import { Transform, TransformConfig } from '../../../../components/transform';
import { Entity } from '../../../../../engine/entity/entity';

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
    const entity1 = new Entity({ id: '1', name: 'mock-entity-1' });
    const entity2 = new Entity({ id: '2', name: 'mock-entity-2' });

    entity1.setComponent('transform', new Transform('transform', baseTransformProps));
    entity2.setComponent('transform', new Transform('transform', baseTransformProps));

    expect(sortByZAxis(entity1, entity2)).toBe(0);

    (entity2.getComponent('transform') as Transform).offsetZ = 50;

    expect(sortByZAxis(entity1, entity2)).toBeLessThan(0);

    (entity1.getComponent('transform') as Transform).offsetZ = 100;

    expect(sortByZAxis(entity1, entity2)).toBeGreaterThan(0);
  });
});
