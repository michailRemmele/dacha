import { Camera } from '../index';

describe('Contrib -> components -> Camera', () => {
  it('Returns correct values ', () => {
    const camera = new Camera('camera', {
      zoom: 100,
    }).clone();

    expect(camera.zoom).toEqual(100);
    expect(camera.windowSizeX).toEqual(0);
    expect(camera.windowSizeY).toEqual(0);
  });

  it('Correct updates values ', () => {
    const camera = new Camera('camera', {
      zoom: 100,
    }).clone();

    camera.zoom = 50;
    camera.windowSizeX = 1920;
    camera.windowSizeY = 1080;

    expect(camera.zoom).toEqual(50);
    expect(camera.windowSizeX).toEqual(1920);
    expect(camera.windowSizeY).toEqual(1080);
  });
});
