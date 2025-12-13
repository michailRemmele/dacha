import { type ViewContainer } from 'pixi.js';

import { Sprite, SpriteConfig } from '../../../../components/sprite';
import { Transform, TransformConfig } from '../../../../components/transform';
import { Actor } from '../../../../../engine/actor/actor';

import { sortByYAxis } from '../sort-by-y-axis';

const createGetGlobalPositionMock = (actor: Actor) => (): { y: number } => ({
  y: actor.getComponent(Transform).offsetY,
});

describe('Contrib -> RenderSystem -> Sort -> sortByYAxis()', () => {
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
    color: '#fff',
    blending: 'normal',
    opacity: 1,
  };
  const baseTransformProps: TransformConfig = {
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  };

  it('Returns correct order of objects while equals height', () => {
    const actor1 = new Actor({ id: '1', name: 'mock-actor-1' });
    const actor2 = new Actor({ id: '2', name: 'mock-actor-2' });

    actor1.setComponent(new Sprite(baseSpriteProps));
    actor1.setComponent(new Transform(baseTransformProps));

    actor2.setComponent(new Sprite(baseSpriteProps));
    actor2.setComponent(new Transform(baseTransformProps));

    const view1 = {
      __dacha: { actor: actor1, viewComponent: actor1.getComponent(Sprite) },
      getGlobalPosition: createGetGlobalPositionMock(actor1),
    } as unknown as ViewContainer;
    const view2 = {
      __dacha: { actor: actor2, viewComponent: actor2.getComponent(Sprite) },
      getGlobalPosition: createGetGlobalPositionMock(actor2),
    } as unknown as ViewContainer;

    expect(sortByYAxis(1)(view1, view2)).toBe(0);

    actor2.getComponent(Transform).offsetY = 50;

    expect(sortByYAxis(1)(view1, view2)).toBeLessThan(0);

    actor1.getComponent(Transform).offsetY = 100;

    expect(sortByYAxis(1)(view1, view2)).toBeGreaterThan(0);
  });
});
