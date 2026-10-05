import { Camera } from '../index';
import type { CameraConfig } from '../index';

describe('Contrib -> components -> Camera', () => {
  it('Returns correct values ', () => {
    const camera = new Camera({
      zoom: 100,
      current: true,
    });

    expect(camera.zoom).toEqual(100);
    expect(camera.current).toEqual(true);
    expect(camera.windowSizeX).toEqual(0);
    expect(camera.windowSizeY).toEqual(0);
  });

  it('Correct updates values ', () => {
    const camera = new Camera({
      zoom: 100,
      current: false,
    });

    camera.zoom = 50;
    camera.current = true;
    camera.windowSizeX = 1920;
    camera.windowSizeY = 1080;

    expect(camera.zoom).toEqual(50);
    expect(camera.current).toEqual(true);
    expect(camera.windowSizeX).toEqual(1920);
    expect(camera.windowSizeY).toEqual(1080);
  });

  it('Uses initial values for missing keys', () => {
    const camera = new Camera({} as CameraConfig);

    expect(camera.zoom).toEqual(1);
    expect(camera.current).toEqual(false);
  });
});
