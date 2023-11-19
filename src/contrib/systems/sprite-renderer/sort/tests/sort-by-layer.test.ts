import { Sprite, SpriteConfig } from '../../../../components/sprite';
import { GameObject } from '../../../../../engine/game-object/game-object';

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
    },
  };

  it('Returns correct order of objects', () => {
    const gameObject1 = new GameObject({ id: '1', name: 'mock-game-object-1' });
    const gameObject2 = new GameObject({ id: '2', name: 'mock-game-object-2' });

    const layers = ['layer-1', 'layer-2', 'layer-3'];

    gameObject1.setComponent(new Sprite(baseSpriteProps));
    gameObject2.setComponent(new Sprite(baseSpriteProps));

    (gameObject1.getComponent(Sprite)).sortingLayer = 'layer-1';
    (gameObject2.getComponent(Sprite)).sortingLayer = 'layer-2';

    expect(createSortByLayer(layers)(gameObject1, gameObject2)).toBe(-1);

    (gameObject1.getComponent(Sprite)).sortingLayer = 'layer-3';

    expect(createSortByLayer(layers)(gameObject1, gameObject2)).toBe(1);

    (gameObject1.getComponent(Sprite)).sortingLayer = 'layer-2';

    expect(createSortByLayer(layers)(gameObject1, gameObject2)).toBe(0);
  });
});
