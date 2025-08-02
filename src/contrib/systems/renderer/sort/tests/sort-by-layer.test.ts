import { type ViewContainer } from 'pixi.js';

import { Sprite, SpriteConfig } from '../../../../components/sprite';
import { Actor } from '../../../../../engine/actor/actor';

import { createSortByLayer } from '../sort-by-layer';

describe('Contrib -> RenderSystem -> Sort -> sortByLayer()', () => {
  const baseSpriteProps: SpriteConfig = {
    src: 'some-path',
    width: 0,
    height: 0,
    sortCenter: [0, 0],
    slice: 1,
    rotation: 0,
    flipX: false,
    flipY: false,
    disabled: false,
    sortingLayer: 'some-layer',
    fit: 'stretch',
    material: {
      type: 'basic',
      options: {},
    },
  };

  it('Returns correct order of objects', () => {
    const actor1 = new Actor({ id: '1', name: 'mock-actor-1' });
    const actor2 = new Actor({ id: '2', name: 'mock-actor-2' });

    const layers = ['layer-1', 'layer-2', 'layer-3'];

    actor1.setComponent(new Sprite(baseSpriteProps));
    actor2.setComponent(new Sprite(baseSpriteProps));

    actor1.getComponent(Sprite).sortingLayer = 'layer-1';
    actor2.getComponent(Sprite).sortingLayer = 'layer-2';

    const view1 = {
      __dacha: {
        viewComponent: actor1.getComponent(Sprite),
      },
    } as unknown as ViewContainer;
    const view2 = {
      __dacha: { viewComponent: actor2.getComponent(Sprite) },
    } as unknown as ViewContainer;

    expect(createSortByLayer(layers)(view1, view2)).toBe(-1);

    actor1.getComponent(Sprite).sortingLayer = 'layer-3';

    expect(createSortByLayer(layers)(view1, view2)).toBe(1);

    actor1.getComponent(Sprite).sortingLayer = 'layer-2';

    expect(createSortByLayer(layers)(view1, view2)).toBe(0);
  });
});
