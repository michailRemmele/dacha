import { Sprite, type ViewContainer } from 'pixi.js';

jest.mock('pixi.js', () => ({
  Sprite: class {},
}));

import { PixiView } from '../index';

describe('Contrib -> components -> PixiView', () => {
  it('Returns correct values ', () => {
    const pixiView = new PixiView({
      buildView: (): ViewContainer => new Sprite(),
      sortingLayer: 'units',
      sortCenter: [0, 0],
    }).clone();

    expect(pixiView.sortingLayer).toEqual('units');
    expect(pixiView.sortCenter).toEqual([0, 0]);
  });

  it('Correct updates values ', () => {
    const pixiView = new PixiView({
      buildView: (): ViewContainer => new Sprite(),
      sortingLayer: 'units',
      sortCenter: [0, 0],
    }).clone();

    pixiView.sortingLayer = 'background';
    pixiView.sortCenter = [10, 10];

    expect(pixiView.sortingLayer).toEqual('background');
    expect(pixiView.sortCenter).toEqual([10, 10]);
  });

  it('Clones return deep copy of original component', () => {
    const originalShape = new PixiView({
      buildView: (): ViewContainer => new Sprite(),
      sortingLayer: 'units',
      sortCenter: [0, 0],
    }).clone();
    const cloneShape = originalShape.clone();

    expect(originalShape).not.toBe(cloneShape);
  });
});
