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
      sortOffsetX: 1,
      sortOffsetY: 2,
    });

    expect(pixiView.sortingLayer).toEqual('units');
    expect(pixiView.sortOffset).toEqual({ x: 1, y: 2 });
  });

  it('Correct updates values ', () => {
    const pixiView = new PixiView({
      createView: (): ViewContainer => new Sprite(),
      sortingLayer: 'units',
      sortOffsetX: 0,
      sortOffsetY: 0,
    });

    pixiView.sortingLayer = 'background';
    pixiView.sortOffset = { x: 10, y: 10 };

    expect(pixiView.sortingLayer).toEqual('background');
    expect(pixiView.sortOffset).toEqual({ x: 10, y: 10 });
  });
});
