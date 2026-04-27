import { Sprite, type ViewContainer } from 'pixi.js';

jest.mock('pixi.js', () => ({
  Sprite: class {},
}));

import { PixiView } from '../index';

describe('Contrib -> components -> PixiView', () => {
  it('Returns correct values ', () => {
    const pixiView = new PixiView({
      createView: (): ViewContainer => new Sprite(),
      sortingLayer: 'units',
      sortOffset: { x: 0, y: 0 },
    }).clone();

    expect(pixiView.sortingLayer).toEqual('units');
    expect(pixiView.sortOffset).toEqual({ x: 0, y: 0 });
  });

  it('Correct updates values ', () => {
    const pixiView = new PixiView({
      createView: (): ViewContainer => new Sprite(),
      sortingLayer: 'units',
      sortOffset: { x: 0, y: 0 },
    }).clone();

    pixiView.sortingLayer = 'background';
    pixiView.sortOffset = { x: 10, y: 10 };

    expect(pixiView.sortingLayer).toEqual('background');
    expect(pixiView.sortOffset).toEqual({ x: 10, y: 10 });
  });

  it('Clones return deep copy of original component', () => {
    const originalShape = new PixiView({
      createView: (): ViewContainer => new Sprite(),
      sortingLayer: 'units',
      sortOffset: { x: 0, y: 0 },
    }).clone();
    const cloneShape = originalShape.clone();

    expect(originalShape).not.toBe(cloneShape);
  });
});
