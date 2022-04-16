import { Renderable, RenderableConfig } from '../../../../components/renderable';
import { Entity } from '../../../../../engine/entity/entity';

import { createSortByLayer } from '../sort-by-layer';

describe('Contrib -> RenderSystem -> Sort -> sortByLayer()', () => {
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

    const layers = ['layer-1', 'layer-2', 'layer-3'];

    entity1.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    entity2.setComponent('renderable', new Renderable('renderable', baseRenderableProps));

    (entity1.getComponent('renderable') as Renderable).sortingLayer = 'layer-1';
    (entity2.getComponent('renderable') as Renderable).sortingLayer = 'layer-2';

    expect(createSortByLayer(layers)(entity1, entity2)).toBe(-1);

    (entity1.getComponent('renderable') as Renderable).sortingLayer = 'layer-3';

    expect(createSortByLayer(layers)(entity1, entity2)).toBe(1);

    (entity1.getComponent('renderable') as Renderable).sortingLayer = 'layer-2';

    expect(createSortByLayer(layers)(entity1, entity2)).toBe(0);
  });
});
