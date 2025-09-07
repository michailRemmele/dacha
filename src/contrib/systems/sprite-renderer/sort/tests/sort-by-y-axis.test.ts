import { Sprite, SpriteConfig } from '../../../../components/sprite';
import { Transform, TransformConfig } from '../../../../components/transform';
import { Actor } from '../../../../../engine/actor/actor';

import { sortByYAxis } from '../sort-by-y-axis';

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
    offsetZ: 0,
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

    expect(sortByYAxis(actor1, actor2)).toBe(0);

    actor2.getComponent(Transform).offsetY = 50;

    expect(sortByYAxis(actor1, actor2)).toBeLessThan(0);

    actor1.getComponent(Transform).offsetY = 100;

    expect(sortByYAxis(actor1, actor2)).toBeGreaterThan(0);
  });

  it('Returns correct order of objects while different height', () => {
    const actor1 = new Actor({ id: '1', name: 'mock-actor-1' });
    const actor2 = new Actor({ id: '2', name: 'mock-actor-2' });

    actor1.setComponent(new Sprite(baseSpriteProps));
    actor1.setComponent(new Transform(baseTransformProps));

    actor2.setComponent(new Sprite(baseSpriteProps));
    actor2.setComponent(new Transform(baseTransformProps));

    actor1.getComponent(Transform).offsetY = 100;
    actor2.getComponent(Transform).offsetY = 50;

    actor1.getComponent(Sprite).height = 10;
    actor2.getComponent(Sprite).height = 100;

    expect(sortByYAxis(actor1, actor2)).toBeGreaterThan(0);

    actor2.getComponent(Sprite).height = 110;

    expect(sortByYAxis(actor1, actor2)).toBe(0);

    actor2.getComponent(Sprite).height = 130;

    expect(sortByYAxis(actor1, actor2)).toBeLessThan(0);
  });
});
