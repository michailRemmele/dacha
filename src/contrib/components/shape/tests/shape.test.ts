import { Shape } from '../index';

describe('Contrib -> components -> Shape', () => {
  it('Returns correct values ', () => {
    const shape = new Shape({
      type: 'rectangle',
      strokeWidth: 2,
      strokeColor: '#000',
      pixelLine: false,
      opacity: 1,
      blending: 'normal',
      disabled: false,
      sortingLayer: 'units',
      sortCenter: [0, 0],
      width: 100,
      height: 200,
      fill: '#999',
    }).clone();

    expect(shape.type).toEqual('rectangle');
    expect(shape.width).toEqual(100);
    expect(shape.height).toEqual(200);
    expect(shape.strokeWidth).toEqual(2);
    expect(shape.strokeColor).toEqual('#000');
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
      pixelLine: false,
      opacity: 1,
      blending: 'normal',
      disabled: false,
      sortingLayer: 'units',
      sortCenter: [0, 0],
      radius: 100,
      fill: '#999',
    }).clone();

    shape.width = 200;
    shape.height = 400;
    shape.fill = '#111';

    expect(shape.width).toEqual(200);
    expect(shape.height).toEqual(400);
    expect(shape.fill).toEqual('#111');
  });

  it('Clones return deep copy of original component', () => {
    const originalShape = new Shape({
      type: 'circle',
      strokeWidth: 2,
      strokeColor: '#000',
      pixelLine: false,
      opacity: 1,
      blending: 'normal',
      disabled: false,
      sortingLayer: 'units',
      sortCenter: [0, 0],
      radius: 100,
      fill: '#999',
    }).clone();
    const cloneShape = originalShape.clone();

    expect(originalShape).not.toBe(cloneShape);
  });
});
