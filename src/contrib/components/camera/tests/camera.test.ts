import { Camera } from '../index';

describe('Contrib -> components -> Camera', () => {
  it('Returns correct values ', () => {
    const camera = new Camera({
      zoom: 100,
    }).clone();

    expect(camera.zoom).toEqual(100);
    expect(camera.windowSizeX).toEqual(0);
    expect(camera.windowSizeY).toEqual(0);
    expect(camera.screenScale).toEqual(1);
  });

  it('Correct updates values ', () => {
    const camera = new Camera({
      zoom: 100,
    }).clone();

    camera.zoom = 50;
    camera.windowSizeX = 1920;
    camera.windowSizeY = 1080;
    camera.screenScale = 0.5;

    expect(camera.zoom).toEqual(25);
    expect(camera.windowSizeX).toEqual(1920);
    expect(camera.windowSizeY).toEqual(1080);
    expect(camera.screenScale).toEqual(0.5);
  });

  it('Clones return deep copy of original component', () => {
    const originalCamera = new Camera({
      zoom: 100,
    });
    const cloneCamera = originalCamera.clone();

    expect(originalCamera).not.toBe(cloneCamera);
  });
});
