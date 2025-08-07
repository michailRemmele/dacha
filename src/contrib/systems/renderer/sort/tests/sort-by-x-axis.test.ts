import { type ViewContainer, type Bounds } from 'pixi.js';

import { Sprite, SpriteConfig } from '../../../../components/sprite';
import { Transform, TransformConfig } from '../../../../components/transform';
import { Actor } from '../../../../../engine/actor/actor';

import { sortByXAxis } from '../sort-by-x-axis';

const updateBounds = (view: ViewContainer): void => {
  const transform = view.__dacha.actor.getComponent(Transform);
  const sprite = view.__dacha.actor.getComponent(Sprite);

  view.__dacha.bounds = {
    minX: transform.offsetX - (sprite.width * transform.scaleX) / 2,
    maxX: transform.offsetX + (sprite.width * transform.scaleX) / 2,
  } as Bounds;
};

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
      options: {},
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
    const actor1 = new Actor({ id: '1', name: 'mock-actor-1' });
    const actor2 = new Actor({ id: '2', name: 'mock-actor-2' });

    actor1.setComponent(new Sprite(baseSpriteProps));
    actor1.setComponent(new Transform(baseTransformProps));

    actor2.setComponent(new Sprite(baseSpriteProps));
    actor2.setComponent(new Transform(baseTransformProps));

    const view1 = {
      __dacha: { actor: actor1, viewComponent: actor1.getComponent(Sprite) },
    } as unknown as ViewContainer;
    const view2 = {
      __dacha: { actor: actor2, viewComponent: actor2.getComponent(Sprite) },
    } as unknown as ViewContainer;

    updateBounds(view1);
    updateBounds(view2);

    expect(sortByXAxis(1)(view1, view2)).toBe(0);

    actor2.getComponent(Transform).offsetX = 50;

    updateBounds(view2);

    expect(sortByXAxis(1)(view1, view2)).toBeLessThan(0);

    actor1.getComponent(Transform).offsetX = 100;

    updateBounds(view1);

    expect(sortByXAxis(1)(view1, view2)).toBeGreaterThan(0);
  });

  it('Returns correct order of objects while different width', () => {
    const actor1 = new Actor({ id: '1', name: 'mock-actor-1' });
    const actor2 = new Actor({ id: '2', name: 'mock-actor-2' });

    actor1.setComponent(new Sprite(baseSpriteProps));
    actor1.setComponent(new Transform(baseTransformProps));

    actor2.setComponent(new Sprite(baseSpriteProps));
    actor2.setComponent(new Transform(baseTransformProps));

    const view1 = {
      __dacha: { actor: actor1, viewComponent: actor1.getComponent(Sprite) },
    } as unknown as ViewContainer;
    const view2 = {
      __dacha: { actor: actor2, viewComponent: actor2.getComponent(Sprite) },
    } as unknown as ViewContainer;

    actor1.getComponent(Transform).offsetX = 100;
    actor2.getComponent(Transform).offsetX = 50;

    actor1.getComponent(Sprite).width = 10;
    actor2.getComponent(Sprite).width = 100;

    updateBounds(view1);
    updateBounds(view2);

    expect(sortByXAxis(1)(view1, view2)).toBeGreaterThan(0);

    actor2.getComponent(Sprite).width = 110;

    updateBounds(view2);

    expect(sortByXAxis(1)(view1, view2)).toBe(0);

    actor2.getComponent(Sprite).width = 130;

    updateBounds(view2);

    expect(sortByXAxis(1)(view1, view2)).toBeLessThan(0);
  });
});
