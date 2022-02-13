import { Renderable, RenderableConfig } from '../../../../components/renderable';
import { GameObject } from '../../../../../engine/gameObject/game-object';

import { sortByFit } from '../sort-by-fit';

describe('Contrib -> RenderProcessor -> Sort -> sortByFit()', () => {
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
  };

  it('Returns correct order of objects', () => {
    const gameObject1 = new GameObject('game-object-1');
    const gameObject2 = new GameObject('game-object-2');

    gameObject1.setComponent('renderable', new Renderable('renderable', baseRenderableProps));
    gameObject2.setComponent('renderable', new Renderable('renderable', baseRenderableProps));

    expect(sortByFit(gameObject1, gameObject2)).toBe(0);

    (gameObject2.getComponent('renderable') as Renderable).fit = 'repeat';

    expect(sortByFit(gameObject1, gameObject2)).toBeGreaterThan(0);

    (gameObject2.getComponent('renderable') as Renderable).fit = 'stretch';
    (gameObject1.getComponent('renderable') as Renderable).fit = 'repeat';

    expect(sortByFit(gameObject1, gameObject2)).toBeLessThan(0);
  });
});
