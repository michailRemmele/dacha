import { Transform, TransformConfig } from '../../../../components/transform';
import { Entity } from '../../../../../engine/entity/entity';

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

  const sortY = (a: Entity, b: Entity) => (
    (a.getComponent('transform') as Transform).offsetY - (b.getComponent('transform') as Transform).offsetY
  );
  const sortX = (a: Entity, b: Entity) => (
    (a.getComponent('transform') as Transform).offsetX - (b.getComponent('transform') as Transform).offsetX
  );
  const sortZ = (a: Entity, b: Entity) => (
    (a.getComponent('transform') as Transform).offsetZ - (b.getComponent('transform') as Transform).offsetZ
  );

  it('Correctly creates composed sort function which executes passing function in correct order', () => {
    const entity1 = new Entity({ id: '1', name: 'mock-entity-1' });
    const entity2 = new Entity({ id: '2', name: 'mock-entity-2' });

    entity1.setComponent('transform', new Transform('transform', baseTransformProps));
    entity2.setComponent('transform', new Transform('transform', baseTransformProps));

    (entity1.getComponent('transform') as Transform).offsetY = 10;
    (entity1.getComponent('transform') as Transform).offsetX = 20;
    (entity1.getComponent('transform') as Transform).offsetZ = 40;

    (entity2.getComponent('transform') as Transform).offsetY = 10;
    (entity2.getComponent('transform') as Transform).offsetX = 20;
    (entity2.getComponent('transform') as Transform).offsetZ = 30;

    expect(composeSort([sortY, sortX, sortZ])(entity1, entity2)).toBeGreaterThan(0);

    (entity2.getComponent('transform') as Transform).offsetX = 30;

    expect(composeSort([sortY, sortX, sortZ])(entity1, entity2)).toBeLessThan(0);

    (entity1.getComponent('transform') as Transform).offsetY = 20;

    expect(composeSort([sortY, sortX, sortZ])(entity1, entity2)).toBeGreaterThan(0);
  });
});
