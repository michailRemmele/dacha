import { Renderable } from '../index';

describe('Contrib -> components -> Renderable', () => {
  it('Returns correct values ', () => {
    const renderable = new Renderable({
      src: 'some-path-to-texture',
      type: 'sprite',
      width: 100,
      height: 200,
      slice: 10,
      spacing: 5,
      extruding: 2,
      rotation: 45,
      sortCenter: [0, 0],
      flipX: false,
      flipY: true,
      disabled: false,
      sortingLayer: 'terrain',
      fit: 'stretch',
      material: {
        type: 'basic',
      },
    }).clone();

    expect(renderable.src).toEqual('some-path-to-texture');
    expect(renderable.type).toEqual('sprite');
    expect(renderable.width).toEqual(100);
    expect(renderable.height).toEqual(200);
    expect(renderable.slice).toEqual(10);
    expect(renderable.spacing).toEqual(5);
    expect(renderable.extruding).toEqual(2);
    expect(renderable.rotation).toEqual(45);
    expect(renderable.sortCenter).toEqual([0, 0]);
    expect(renderable.flipX).toEqual(false);
    expect(renderable.flipY).toEqual(true);
    expect(renderable.disabled).toEqual(false);
    expect(renderable.sortingLayer).toEqual('terrain');
    expect(renderable.fit).toEqual('stretch');
    expect(renderable.material.type).toEqual('basic');
  });

  it('Correct updates values ', () => {
    const renderable = new Renderable({
      src: 'some-path-to-texture',
      type: 'sprite',
      width: 100,
      height: 200,
      slice: 10,
      spacing: 5,
      extruding: 2,
      rotation: 45,
      sortCenter: [0, 0],
      flipX: false,
      flipY: true,
      disabled: false,
      sortingLayer: 'terrain',
      fit: 'stretch',
      material: {
        type: 'basic',
      },
    }).clone();

    renderable.src = 'another-path-to-texture';
    renderable.type = 'static';
    renderable.width = 200;
    renderable.height = 400;
    renderable.slice = 55;
    renderable.spacing = 3;
    renderable.extruding = 2;
    renderable.rotation = 90;
    renderable.sortCenter = [5, 10];
    renderable.flipX = true;
    renderable.flipY = false;
    renderable.disabled = true;
    renderable.sortingLayer = 'units';
    renderable.fit = 'repeat';
    renderable.material.type = 'lightsensitive';
    renderable.material.options.color = '#000';
    renderable.material.options.blending = 'multiply';

    expect(renderable.src).toEqual('another-path-to-texture');
    expect(renderable.type).toEqual('static');
    expect(renderable.width).toEqual(200);
    expect(renderable.height).toEqual(400);
    expect(renderable.slice).toEqual(1);
    expect(renderable.spacing).toEqual(3);
    expect(renderable.extruding).toEqual(2);
    expect(renderable.rotation).toEqual(90);
    expect(renderable.sortCenter).toEqual([5, 10]);
    expect(renderable.flipX).toEqual(true);
    expect(renderable.flipY).toEqual(false);
    expect(renderable.disabled).toEqual(true);
    expect(renderable.sortingLayer).toEqual('units');
    expect(renderable.fit).toEqual('repeat');
    expect(renderable.material.type).toEqual('lightsensitive');
    expect(renderable.material.options.color).toEqual('#000');
    expect(renderable.material.options.blending).toEqual('multiply');
  });

  it('Clones return deep copy of original component', () => {
    const originalRenderable = new Renderable({
      src: 'some-path-to-texture',
      type: 'sprite',
      width: 100,
      height: 200,
      slice: 10,
      spacing: 5,
      extruding: 2,
      rotation: 45,
      sortCenter: [0, 0],
      flipX: false,
      flipY: true,
      disabled: false,
      sortingLayer: 'terrain',
      fit: 'stretch',
      material: {
        type: 'basic',
      },
    });
    const cloneRenderable = originalRenderable.clone();

    expect(originalRenderable).not.toBe(cloneRenderable);
    expect(originalRenderable.sortCenter).not.toBe(cloneRenderable.sortCenter);
  });
});
