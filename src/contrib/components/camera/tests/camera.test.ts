import { Camera } from '../index';

describe('Contrib -> components -> Camera', () => {
  it('Returns correct values ', () => {
    const camera = new Camera({
      zoom: 100,
      current: true,
    }).clone();

    expect(camera.zoom).toEqual(100);
    expect(camera.current).toEqual(true);
    expect(camera.windowSizeX).toEqual(0);
    expect(camera.windowSizeY).toEqual(0);
  });

  it('Correct updates values ', () => {
    const camera = new Camera({
      zoom: 100,
      current: false,
    }).clone();

    camera.zoom = 50;
    camera.current = true;
    camera.windowSizeX = 1920;
    camera.windowSizeY = 1080;

    expect(camera.zoom).toEqual(50);
    expect(camera.current).toEqual(true);
    expect(camera.windowSizeX).toEqual(1920);
    expect(camera.windowSizeY).toEqual(1080);
  });

  it('Clones return deep copy of original component', () => {
    const originalCamera = new Camera({
      zoom: 100,
      current: false,
    });
    const cloneCamera = originalCamera.clone();

    expect(originalCamera).not.toBe(cloneCamera);
  });
});
