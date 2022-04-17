import { Renderable, RenderableConfig } from '../../../../components/renderable';
import { Entity } from '../../../../../engine/entity/entity';

import { sortByFit } from '../sort-by-fit';

describe('Contrib -> RenderSystem -> Sort -> sortByFit()', () => {
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

  it('Returns correct order of objects', () => {
    const entity1 = new Entity({ id: '1', name: 'mock-entity-1' });
    const entity2 = new Entity({ id: '2', name: 'mock-entity-2' });

    entity1.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    entity2.setComponent('renderable', new Renderable('renderable', baseRenderableProps));

    expect(sortByFit(entity1, entity2)).toBe(0);

    (entity2.getComponent('renderable') as Renderable).fit = 'repeat';

    expect(sortByFit(entity1, entity2)).toBeGreaterThan(0);

    (entity2.getComponent('renderable') as Renderable).fit = 'stretch';
    (entity1.getComponent('renderable') as Renderable).fit = 'repeat';

    expect(sortByFit(entity1, entity2)).toBeLessThan(0);
  });
});
