import { Sprite, SpriteConfig } from '../../../../components/sprite';
import { Transform, TransformConfig } from '../../../../components/transform';
import { GameObject } from '../../../../../engine/game-object/game-object';

import { sortByXAxis } from '../sort-by-x-axis';

describe('Contrib -> RenderSystem -> Sort -> sortByXAxis()', () => {
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
  const baseTransformProps: TransformConfig = {
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  };

  it('Returns correct order of objects while equals width', () => {
    const gameObject1 = new GameObject({ id: '1', name: 'mock-game-object-1' });
    const gameObject2 = new GameObject({ id: '2', name: 'mock-game-object-2' });

    gameObject1.setComponent(new Sprite(baseSpriteProps));
    gameObject1.setComponent(new Transform(baseTransformProps));

    gameObject2.setComponent(new Sprite(baseSpriteProps));
    gameObject2.setComponent(new Transform(baseTransformProps));

    expect(sortByXAxis(gameObject1, gameObject2)).toBe(0);

    (gameObject2.getComponent(Transform)).offsetX = 50;

    expect(sortByXAxis(gameObject1, gameObject2)).toBeLessThan(0);

    (gameObject1.getComponent(Transform)).offsetX = 100;

    expect(sortByXAxis(gameObject1, gameObject2)).toBeGreaterThan(0);
  });

  it('Returns correct order of objects while different width', () => {
    const gameObject1 = new GameObject({ id: '1', name: 'mock-game-object-1' });
    const gameObject2 = new GameObject({ id: '2', name: 'mock-game-object-2' });

    gameObject1.setComponent(new Sprite(baseSpriteProps));
    gameObject1.setComponent(new Transform(baseTransformProps));

    gameObject2.setComponent(new Sprite(baseSpriteProps));
    gameObject2.setComponent(new Transform(baseTransformProps));

    (gameObject1.getComponent(Transform)).offsetX = 100;
    (gameObject2.getComponent(Transform)).offsetX = 50;

    (gameObject1.getComponent(Sprite)).width = 10;
    (gameObject2.getComponent(Sprite)).width = 100;

    expect(sortByXAxis(gameObject1, gameObject2)).toBeGreaterThan(0);

    (gameObject2.getComponent(Sprite)).width = 110;

    expect(sortByXAxis(gameObject1, gameObject2)).toBe(0);

    (gameObject2.getComponent(Sprite)).width = 130;

    expect(sortByXAxis(gameObject1, gameObject2)).toBeLessThan(0);
  });
});
