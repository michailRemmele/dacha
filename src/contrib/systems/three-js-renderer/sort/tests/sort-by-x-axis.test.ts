import { Renderable, RenderableConfig } from '../../../../components/renderable';
import { Transform, TransformConfig } from '../../../../components/transform';
import { Entity } from '../../../../../engine/entity/entity';

import { sortByXAxis } from '../sort-by-x-axis';

describe('Contrib -> RenderSystem -> Sort -> sortByXAxis()', () => {
  const baseRenderableProps: RenderableConfig = {
    src: 'some-path',
    width: 0,
    height: 0,
    sortCenter: [0, 0],
    type: 'static',
    spacing: 0,
    extruding: 0,
    rotation: 0,
    flipX: false,
    flipY: false,
    disabled: false,
    sortingLayer: 'some-layer',
    fit: 'stretch',
    material: {
      type: 'basic',
    },
  };
  const baseTransformProps: TransformConfig = {
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  };

  it('Returns correct order of objects while equals width', () => {
    const entity1 = new Entity({ id: '1', name: 'mock-entity-1' });
    const entity2 = new Entity({ id: '2', name: 'mock-entity-2' });

    entity1.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    entity1.setComponent('transform', new Transform('transform', baseTransformProps));

    entity2.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    entity2.setComponent('transform', new Transform('transform', baseTransformProps));

    expect(sortByXAxis(entity1, entity2)).toBe(0);

    (entity2.getComponent('transform') as Transform).offsetX = 50;

    expect(sortByXAxis(entity1, entity2)).toBeLessThan(0);

    (entity1.getComponent('transform') as Transform).offsetX = 100;

    expect(sortByXAxis(entity1, entity2)).toBeGreaterThan(0);
  });

  it('Returns correct order of objects while different width', () => {
    const entity1 = new Entity({ id: '1', name: 'mock-entity-1' });
    const entity2 = new Entity({ id: '2', name: 'mock-entity-2' });

    entity1.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    entity1.setComponent('transform', new Transform('transform', baseTransformProps));

    entity2.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    entity2.setComponent('transform', new Transform('transform', baseTransformProps));

    (entity1.getComponent('transform') as Transform).offsetX = 100;
    (entity2.getComponent('transform') as Transform).offsetX = 50;

    (entity1.getComponent('renderable') as Renderable).width = 10;
    (entity2.getComponent('renderable') as Renderable).width = 100;

    expect(sortByXAxis(entity1, entity2)).toBeGreaterThan(0);

    (entity2.getComponent('renderable') as Renderable).width = 110;

    expect(sortByXAxis(entity1, entity2)).toBe(0);

    (entity2.getComponent('renderable') as Renderable).width = 130;

    expect(sortByXAxis(entity1, entity2)).toBeLessThan(0);
  });
});
