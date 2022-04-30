import { Renderable, RenderableConfig } from '../../../../components/renderable';
import { Transform, TransformConfig } from '../../../../components/transform';
import { GameObject } from '../../../../../engine/game-object/game-object';

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
    const gameObject1 = new GameObject({ id: '1', name: 'mock-game-object-1' });
    const gameObject2 = new GameObject({ id: '2', name: 'mock-game-object-2' });

    gameObject1.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    gameObject1.setComponent('transform', new Transform('transform', baseTransformProps));

    gameObject2.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    gameObject2.setComponent('transform', new Transform('transform', baseTransformProps));

    expect(sortByXAxis(gameObject1, gameObject2)).toBe(0);

    (gameObject2.getComponent('transform') as Transform).offsetX = 50;

    expect(sortByXAxis(gameObject1, gameObject2)).toBeLessThan(0);

    (gameObject1.getComponent('transform') as Transform).offsetX = 100;

    expect(sortByXAxis(gameObject1, gameObject2)).toBeGreaterThan(0);
  });

  it('Returns correct order of objects while different width', () => {
    const gameObject1 = new GameObject({ id: '1', name: 'mock-game-object-1' });
    const gameObject2 = new GameObject({ id: '2', name: 'mock-game-object-2' });

    gameObject1.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    gameObject1.setComponent('transform', new Transform('transform', baseTransformProps));

    gameObject2.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    gameObject2.setComponent('transform', new Transform('transform', baseTransformProps));

    (gameObject1.getComponent('transform') as Transform).offsetX = 100;
    (gameObject2.getComponent('transform') as Transform).offsetX = 50;

    (gameObject1.getComponent('renderable') as Renderable).width = 10;
    (gameObject2.getComponent('renderable') as Renderable).width = 100;

    expect(sortByXAxis(gameObject1, gameObject2)).toBeGreaterThan(0);

    (gameObject2.getComponent('renderable') as Renderable).width = 110;

    expect(sortByXAxis(gameObject1, gameObject2)).toBe(0);

    (gameObject2.getComponent('renderable') as Renderable).width = 130;

    expect(sortByXAxis(gameObject1, gameObject2)).toBeLessThan(0);
  });
});
