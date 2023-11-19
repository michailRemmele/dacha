import { Sprite, SpriteConfig } from '../../../../components/sprite';
import { GameObject } from '../../../../../engine/game-object/game-object';

import { sortByFit } from '../sort-by-fit';

describe('Contrib -> RenderSystem -> Sort -> sortByFit()', () => {
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

    gameObject1.setComponent(new Sprite(baseSpriteProps));
    gameObject2.setComponent(new Sprite(baseSpriteProps));

    expect(sortByFit(gameObject1, gameObject2)).toBe(0);

    (gameObject2.getComponent(Sprite)).fit = 'repeat';

    expect(sortByFit(gameObject1, gameObject2)).toBeGreaterThan(0);

    (gameObject2.getComponent(Sprite)).fit = 'stretch';
    (gameObject1.getComponent(Sprite)).fit = 'repeat';

    expect(sortByFit(gameObject1, gameObject2)).toBeLessThan(0);
  });
});
