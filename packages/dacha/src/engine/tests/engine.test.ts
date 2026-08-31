import { Engine } from '../engine';
import { Asset } from '../asset';
import type { Assets } from '../asset';
import { WorldSystem } from '../system';
import type { WorldSystemOptions } from '../system';
import { Texture } from '../../contrib/assets';

class Broken extends Asset {}

let capturedAssets: Assets | undefined;

class AssetsCapturingSystem extends WorldSystem {
  constructor(options: WorldSystemOptions) {
    super();
    capturedAssets = options.assets;
  }
}
AssetsCapturingSystem.systemName = 'assets-capturing-system';

describe('Engine', () => {
  let originalRequestAnimationFrame: typeof requestAnimationFrame;
  let originalCancelAnimationFrame: typeof cancelAnimationFrame;

  beforeEach(() => {
    capturedAssets = undefined;

    originalRequestAnimationFrame = global.requestAnimationFrame;
    originalCancelAnimationFrame = global.cancelAnimationFrame;

    global.requestAnimationFrame = jest.fn(() => 1);
    global.cancelAnimationFrame = jest.fn();
  });

  afterEach(() => {
    global.requestAnimationFrame = originalRequestAnimationFrame;
    global.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  it('throws if an asset class is missing assetName', async () => {
    const engine = new Engine({
      config: {
        scenes: [],
        templates: [],
        systems: [],
        assets: [],
        startSceneId: 'scene-1',
        globalOptions: [],
      },
      systems: [],
      components: [],
      assets: [Broken],
    });

    await expect(engine.play()).rejects.toThrow(
      'Missing assetName field for Broken asset.',
    );
  });

  it('registers config asset records into the registry handed to systems', async () => {
    const engine = new Engine({
      config: {
        scenes: [{ id: 'scene-1', name: 'Scene 1', actors: [] }],
        templates: [],
        systems: [{ name: 'assets-capturing-system', options: {} }],
        assets: [
          {
            id: 'a1',
            name: 'Hero',
            kind: 'texture',
            data: { src: 'img/hero.png' },
          },
        ],
        startSceneId: 'scene-1',
        globalOptions: [],
      },
      systems: [AssetsCapturingSystem],
      components: [],
      assets: [Texture],
    });

    await engine.play();

    expect(capturedAssets?.get('a1', Texture).src).toBe('img/hero.png');

    engine.stop();
  });
});
