import { Sprite, SpriteConfig } from '../../../../components/sprite';
import { Actor } from '../../../../../engine/actor/actor';

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
    color: '#fff',
    blending: 'normal',
    opacity: 1,
  };

  it('Returns correct order of objects', () => {
    const actor1 = new Actor({ id: '1', name: 'mock-actor-1' });
    const actor2 = new Actor({ id: '2', name: 'mock-actor-2' });

    actor1.setComponent(new Sprite({ ...baseSpriteProps, fit: 'repeat' }));
    actor2.setComponent(new Sprite({ ...baseSpriteProps, fit: 'stretch' }));

    expect(sortByFit(actor1, actor2)).toBeLessThan(0);
  });
});
