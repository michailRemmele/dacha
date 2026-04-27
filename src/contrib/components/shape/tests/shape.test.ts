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
      sortOffset: { x: 0, y: 0 },
      size: { x: 100, y: 200 },
      fill: '#999',
    }).clone();

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
      sortOffset: { x: 0, y: 0 },
      radius: 100,
      fill: '#999',
    }).clone();

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

  it('Clones return deep copy of original component', () => {
    const originalShape = new Shape({
      type: 'circle',
      strokeWidth: 2,
      strokeColor: '#000',
      strokeAlignment: 0.5,
      pixelLine: false,
      opacity: 1,
      blending: 'normal',
      disabled: false,
      sortingLayer: 'units',
      sortOffset: { x: 0, y: 0 },
      radius: 100,
      fill: '#999',
    }).clone();
    const cloneShape = originalShape.clone();

    expect(originalShape).not.toBe(cloneShape);
  });
});
