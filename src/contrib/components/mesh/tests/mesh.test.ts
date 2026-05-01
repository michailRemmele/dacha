import { Mesh } from '../index';

describe('Contrib -> components -> Mesh', () => {
  it('Returns correct values ', () => {
    const mesh = new Mesh({
      src: 'some-path-to-texture',
      width: 100,
      height: 200,
      slice: 10,
      sortOffsetX: 1,
      sortOffsetY: 2,
      flipX: false,
      flipY: true,
      disabled: false,
      sortingLayer: 'terrain',
      color: '#fff',
      blending: 'normal',
      opacity: 1,
      material: {
        name: 'some-material',
        options: { value: 1 },
      },
    });

    expect(mesh.src).toEqual('some-path-to-texture');
    expect(mesh.width).toEqual(100);
    expect(mesh.height).toEqual(200);
    expect(mesh.slice).toEqual(10);
    expect(mesh.sortOffset).toEqual({ x: 1, y: 2 });
    expect(mesh.flipX).toEqual(false);
    expect(mesh.flipY).toEqual(true);
    expect(mesh.disabled).toEqual(false);
    expect(mesh.sortingLayer).toEqual('terrain');
    expect(mesh.color).toEqual('#fff');
    expect(mesh.blending).toEqual('normal');
    expect(mesh.opacity).toEqual(1);
    expect(mesh.material).toEqual({
      name: 'some-material',
      options: { value: 1 },
    });
  });

  it('Correct updates values ', () => {
    const mesh = new Mesh({
      src: 'some-path-to-texture',
      width: 100,
      height: 200,
      slice: 10,
      sortOffsetX: 0,
      sortOffsetY: 0,
      flipX: false,
      flipY: true,
      disabled: false,
      sortingLayer: 'terrain',
      color: '#fff',
      blending: 'normal',
      opacity: 1,
    });

    mesh.src = 'another-path-to-texture';
    mesh.width = 200;
    mesh.height = 400;
    mesh.slice = 55;
    mesh.sortOffset = { x: 5, y: 10 };
    mesh.flipX = true;
    mesh.flipY = false;
    mesh.disabled = true;
    mesh.sortingLayer = 'units';
    mesh.color = '#000';
    mesh.blending = 'multiply';
    mesh.opacity = 0.5;
    mesh.material = {
      name: 'another-material',
      options: { value: 2 },
    };

    expect(mesh.src).toEqual('another-path-to-texture');
    expect(mesh.width).toEqual(200);
    expect(mesh.height).toEqual(400);
    expect(mesh.slice).toEqual(55);
    expect(mesh.sortOffset).toEqual({ x: 5, y: 10 });
    expect(mesh.flipX).toEqual(true);
    expect(mesh.flipY).toEqual(false);
    expect(mesh.disabled).toEqual(true);
    expect(mesh.sortingLayer).toEqual('units');
    expect(mesh.color).toEqual('#000');
    expect(mesh.blending).toEqual('multiply');
    expect(mesh.opacity).toEqual(0.5);
    expect(mesh.material).toEqual({
      name: 'another-material',
      options: { value: 2 },
    });
  });
});
