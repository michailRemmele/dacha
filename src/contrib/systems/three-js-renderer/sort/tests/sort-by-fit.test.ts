import { Renderable, RenderableConfig } from '../../../../components/renderable';
import { GameObject } from '../../../../../engine/game-object/game-object';

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
    const gameObject1 = new GameObject({ id: '1', name: 'mock-game-object-1' });
    const gameObject2 = new GameObject({ id: '2', name: 'mock-game-object-2' });

    gameObject1.setComponent(new Renderable(baseRenderableProps));
    gameObject2.setComponent(new Renderable(baseRenderableProps));

    expect(sortByFit(gameObject1, gameObject2)).toBe(0);

    (gameObject2.getComponent(Renderable)).fit = 'repeat';

    expect(sortByFit(gameObject1, gameObject2)).toBeGreaterThan(0);

    (gameObject2.getComponent(Renderable)).fit = 'stretch';
    (gameObject1.getComponent(Renderable)).fit = 'repeat';

    expect(sortByFit(gameObject1, gameObject2)).toBeLessThan(0);
  });
});
