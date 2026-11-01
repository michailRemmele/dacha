import { SceneManager } from '../scene-manager';
import { WorldSystem, SceneSystem, normalizeSystems } from '../../system';
import type { WorldSystemOptions, SceneSystemOptions } from '../../system';
import { TemplateCollection } from '../../template';
import { Assets, MediaAsset } from '../../asset';
import { ReferenceWalker } from '../../reference';
import { Component } from '../../component';
import {
  DefineAsset,
  DefineComponent,
  DefineField,
  DefineSystem,
} from '../../decorators';
import { Time } from '../../time';
import type { SceneConfig, TemplateConfig } from '../../types';

const events: string[] = [];

@DefineAsset({ name: 'picture' })
class Picture extends MediaAsset<string> {
  protected fetchResource(): Promise<string> {
    events.push(`load ${this.id}`);
    return Promise.resolve(`res-${this.id}`);
  }

  protected disposeResource(): void {
    events.push(`unload ${this.id}`);
  }
}

@DefineComponent({ name: 'View' })
class View extends Component {
  @DefineField({ type: 'asset', kind: 'picture' }) picture!: string;
}

const template = (id: string, picture: string): TemplateConfig => ({
  id,
  name: id,
  components: [{ name: 'View', config: { picture } }],
  children: [],
});

@DefineSystem({
  name: 'Background',
  fields: [{ name: 'picture', type: 'asset', kind: 'picture' }],
})
class Background extends WorldSystem {
  constructor(options: WorldSystemOptions) {
    super();
    events.push(
      `construct world: ${String(options.assets.get(Picture, 'bg')!.resource)}`,
    );
  }
}

let sceneAssets: Assets | undefined;

@DefineSystem({ name: 'Probe' })
class Probe extends SceneSystem {
  constructor(options: SceneSystemOptions) {
    super();
    sceneAssets = options.assets;
  }

  async onSceneLoad(): Promise<void> {
    events.push(
      `onSceneLoad: ${String(sceneAssets?.get(Picture, 'hero')!.resource)}`,
    );
  }
}

@DefineSystem({
  name: 'Backdrop',
  fields: [{ name: 'picture', type: 'asset', kind: 'picture' }],
})
class Backdrop extends SceneSystem {}

const scene = (id: string, picture: string): SceneConfig => ({
  id,
  name: id,
  actors: [
    {
      id: `${id}-actor`,
      name: 'actor',
      children: [],
      components: [{ name: 'View', config: { picture } }],
    },
  ],
});

describe('SceneManager -> assets', () => {
  let assets: Assets;
  let sceneManager: SceneManager;

  beforeEach(() => {
    events.length = 0;

    const templateCollection = new TemplateCollection();
    templateCollection.register(template('A', 'pa'));
    templateCollection.register(template('D', 'pd'));

    assets = new Assets({
      assetClasses: [Picture],
      configs: ['bg', 'sky', 'hero', 'villain', 'pa', 'pd'].map((id) => ({
        id,
        name: id,
        kind: 'picture',
        data: {},
      })),
      templates: templateCollection,
      walker: new ReferenceWalker([View, Background, Probe, Backdrop, Picture]),
    });

    sceneManager = new SceneManager({
      sceneConfigs: [
        scene('scene-1', 'hero'),
        scene('scene-2', 'villain'),
        {
          id: 'scene-3',
          name: 'scene-3',
          actors: [
            {
              id: 'spawned',
              name: 'spawned',
              templateId: 'A',
              children: [],
              components: [],
            },
          ],
        },
      ],
      systemConfigs: [
        { name: 'Background', options: { picture: 'bg' } },
        { name: 'Probe', options: {} },
        { name: 'Backdrop', options: { picture: 'sky' } },
      ],
      systems: normalizeSystems([Background, Probe, Backdrop]),
      components: [View],
      globalOptions: {},
      templateCollection,
      assets,
      time: new Time(),
    });
  });

  it('loads the media of reachable templates only', async () => {
    await sceneManager.loadWorld();
    await sceneManager.loadScene('scene-3', false);

    expect(events).toContain('load pa');
    expect(events).not.toContain('load pd');
  });

  it('loads the world set before constructing world systems', async () => {
    await sceneManager.loadWorld();

    expect(events).toEqual(['load bg', 'construct world: res-bg']);
  });

  it('loads the scene set before onSceneLoad and passes the registry', async () => {
    await sceneManager.loadWorld();
    await sceneManager.loadScene('scene-1', true);

    expect(sceneAssets).toBe(assets);
    expect(events).toContain('onSceneLoad: res-hero');
  });

  it('unloads the old scene set after switching scenes', async () => {
    await sceneManager.loadWorld();
    await sceneManager.loadScene('scene-1', true);
    await sceneManager.loadScene('scene-2', true, true);

    expect(events).toContain('unload hero');
    expect(events).not.toContain('unload villain');
    expect(events).not.toContain('unload bg');
  });

  it('keeps textures when the active scene reloads', async () => {
    await sceneManager.loadWorld();
    await sceneManager.loadScene('scene-1', true);
    events.length = 0;

    await sceneManager.loadScene('scene-1', true);

    expect(events).not.toContain('unload hero');
    expect(events).not.toContain('load hero');
  });

  it('holds scene system options with the scene, not with the world', async () => {
    await sceneManager.loadWorld();
    await sceneManager.loadScene('scene-1', true);
    expect(events).toContain('load sky');

    await sceneManager.loadScene('scene-2', true, true);
    expect(events).not.toContain('unload sky');

    sceneManager.exitActiveScene();
    sceneManager.destroyScene('scene-2');
    expect(events).toContain('unload sky');
  });

  it('releases the world set on destroyWorld', async () => {
    await sceneManager.loadWorld();
    await sceneManager.loadScene('scene-1', true);

    sceneManager.destroyWorld();

    expect(events).toEqual(
      expect.arrayContaining(['unload hero', 'unload bg']),
    );
  });
});
