import { Engine } from '../engine';
import { Asset, MediaAsset } from '../asset';
import type { Assets } from '../asset';
import { WorldSystem } from '../system';
import type { WorldSystemOptions } from '../system';
import { DefineAsset, DefineBehavior, DefineField } from '../decorators';
import { Texture } from '../../contrib/assets';
import { Behaviors } from '../../contrib/components';
import {
  Behavior,
  BehaviorSystem,
} from '../../contrib/systems/behavior-system';

class Broken extends Asset {}

let capturedAssets: Assets | undefined;

class AssetsCapturingSystem extends WorldSystem {
  constructor(options: WorldSystemOptions) {
    super();
    capturedAssets = options.assets;
  }
}
AssetsCapturingSystem.systemName = 'assets-capturing-system';

@DefineAsset({ name: 'sound' })
class Sound extends MediaAsset<string> {
  protected fetchResource(): Promise<string> {
    return Promise.resolve(`buffer-${this.id}`);
  }
}

@DefineBehavior({ name: 'Shoot' })
class Shoot extends Behavior {
  @DefineField({ type: 'asset', kind: 'sound' }) sound!: string;
}

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

    expect(capturedAssets?.get(Texture, 'a1')!.src).toBe('img/hero.png');

    engine.stop();
  });

  it('passes dependencies from with() to the world system constructor', async () => {
    let capturedDependencies: unknown;

    class DepsCapturingSystem extends WorldSystem {
      constructor(
        options: WorldSystemOptions,
        dependencies?: { value: number },
      ) {
        super();
        void options;
        capturedDependencies = dependencies;
      }
    }
    DepsCapturingSystem.systemName = 'dependencies-capturing-system';

    const dependencies = { value: 1 };
    const engine = new Engine({
      config: {
        scenes: [{ id: 'scene-1', name: 'Scene 1', actors: [] }],
        templates: [],
        systems: [{ name: 'dependencies-capturing-system', options: {} }],
        assets: [],
        startSceneId: 'scene-1',
        globalOptions: [],
      },
      systems: [DepsCapturingSystem, DepsCapturingSystem.with(dependencies)],
      components: [],
      assets: [],
    });

    await engine.play();

    expect(capturedDependencies).toBe(dependencies);

    engine.stop();
  });

  it('loads assets referenced by scripts passed to a system with with()', async () => {
    const engine = new Engine({
      config: {
        scenes: [
          {
            id: 'scene-1',
            name: 'Scene 1',
            actors: [
              {
                id: 'player',
                name: 'Player',
                children: [],
                components: [
                  {
                    name: 'Behaviors',
                    config: {
                      list: [{ id: '1', name: 'Shoot', options: { sound: 's1' } }],
                    },
                  },
                ],
              },
            ],
          },
        ],
        templates: [],
        systems: [{ name: 'assets-capturing-system', options: {} }],
        assets: [{ id: 's1', name: 'Shot', kind: 'sound', data: {} }],
        startSceneId: 'scene-1',
        globalOptions: [],
      },
      systems: [
        AssetsCapturingSystem,
        BehaviorSystem.with({ behaviors: [Shoot] }),
      ],
      components: [Behaviors],
      assets: [Sound],
    });

    await engine.play();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(capturedAssets?.get(Sound, 's1')?.resource).toBe('buffer-s1');

    engine.stop();
  });
});
