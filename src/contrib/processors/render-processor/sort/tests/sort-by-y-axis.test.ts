import { Renderable, RenderableConfig } from '../../../../components/renderable';
import { Transform, TransformConfig } from '../../../../components/transform';
import { GameObject } from '../../../../../engine/gameObject/game-object';

import { sortByYAxis } from '../sort-by-y-axis';

describe('Contrib -> RenderProcessor -> Sort -> sortByYAxis()', () => {
  const baseRenderableProps: RenderableConfig = {
    src: 'some-path',
    width: 0,
    height: 0,
    origin: [0, 0],
    type: 'static',
    spacing: 0,
    extruding: 0,
    rotation: 0,
    flipX: false,
    flipY: false,
    disabled: false,
    sortingLayer: 'some-layer',
  };
  const baseTransformProps: TransformConfig = {
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  };

  it('Returns correct order of objects while equals height', () => {
    const gameObject1 = new GameObject('game-object-1');
    const gameObject2 = new GameObject('game-object-2');

    gameObject1.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    gameObject1.setComponent('transform', new Transform('transform', baseTransformProps));

    gameObject2.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    gameObject2.setComponent('transform', new Transform('transform', baseTransformProps));

    expect(sortByYAxis(gameObject1, gameObject2)).toBe(0);

    (gameObject2.getComponent('transform') as Transform).offsetY = 50;

    expect(sortByYAxis(gameObject1, gameObject2)).toBeLessThan(0);

    (gameObject1.getComponent('transform') as Transform).offsetY = 100;

    expect(sortByYAxis(gameObject1, gameObject2)).toBeGreaterThan(0);
  });

  it('Returns correct order of objects while different height', () => {
    const gameObject1 = new GameObject('game-object-1');
    const gameObject2 = new GameObject('game-object-2');

    gameObject1.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    gameObject1.setComponent('transform', new Transform('transform', baseTransformProps));

    gameObject2.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    gameObject2.setComponent('transform', new Transform('transform', baseTransformProps));

    (gameObject1.getComponent('transform') as Transform).offsetY = 100;
    (gameObject2.getComponent('transform') as Transform).offsetY = 50;

    (gameObject1.getComponent('renderable') as Renderable).height = 10;
    (gameObject2.getComponent('renderable') as Renderable).height = 100;

    expect(sortByYAxis(gameObject1, gameObject2)).toBeGreaterThan(0);

    (gameObject2.getComponent('renderable') as Renderable).height = 110;

    expect(sortByYAxis(gameObject1, gameObject2)).toBe(0);

    (gameObject2.getComponent('renderable') as Renderable).height = 130;

    expect(sortByYAxis(gameObject1, gameObject2)).toBeLessThan(0);
  });
});
