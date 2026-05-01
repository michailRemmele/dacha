import { Shape } from '../index';

describe('Contrib -> components -> Shape', () => {
  it('Returns correct values ', () => {
    const shape = new Shape({
      type: 'rectangle',
      strokeWidth: 2,
      strokeColor: '#000',
      strokeAlignment: 0.5,
      pixelLine: false,
      opacity: 1,
      blending: 'normal',
      disabled: false,
      sortingLayer: 'units',
      sortOffsetX: 1,
      sortOffsetY: 2,
      sizeX: 100,
      sizeY: 200,
      fill: '#999',
    });

    expect(shape.geometry.type).toEqual('rectangle');
    expect(shape.geometry).toStrictEqual({
      type: 'rectangle',
      size: { x: 100, y: 200 },
    });
    expect(shape.strokeWidth).toEqual(2);
    expect(shape.strokeColor).toEqual('#000');
    expect(shape.strokeAlignment).toEqual(0.5);
    expect(shape.opacity).toEqual(1);
    expect(shape.disabled).toEqual(false);
    expect(shape.sortingLayer).toEqual('units');
    expect(shape.sortOffset).toEqual({ x: 1, y: 2 });
    expect(shape.fill).toEqual('#999');
  });

  it('Correct updates values ', () => {
    const shape = new Shape({
      type: 'circle',
      strokeWidth: 2,
      strokeColor: '#000',
      strokeAlignment: 0.5,
      pixelLine: false,
      opacity: 1,
      blending: 'normal',
      disabled: false,
      sortingLayer: 'units',
      sortOffsetX: 0,
      sortOffsetY: 0,
      radius: 100,
      fill: '#999',
    });

    shape.geometry = {
      type: 'rectangle',
      size: { x: 200, y: 400 },
    };
    shape.fill = '#111';

    expect(shape.geometry).toStrictEqual({
      type: 'rectangle',
      size: { x: 200, y: 400 },
    });
    expect(shape.fill).toEqual('#111');
  });
});
