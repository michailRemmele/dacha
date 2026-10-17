import { SceneManager } from '../scene-manager';
import { WorldSystem, SceneSystem } from '../../system';
import type { WorldSystemOptions, SceneSystemOptions } from '../../system';
import { TemplateCollection } from '../../template';
import { Assets, MediaAsset } from '../../asset';
import { Component } from '../../component';
import {
  DefineAsset,
  DefineComponent,
  DefineField,
  DefineSystem,
} from '../../decorators';
import { Time } from '../../time';
import type { SceneConfig } from '../../types';

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

    assets = new Assets({
      assetClasses: [Picture],
      configs: ['bg', 'hero', 'villain'].map((id) => ({
        id,
        name: id,
        kind: 'picture',
        data: {},
      })),
      components: [View],
      systems: [Background, Probe],
    });

    sceneManager = new SceneManager({
      sceneConfigs: [scene('scene-1', 'hero'), scene('scene-2', 'villain')],
      systemConfigs: [
        { name: 'Background', options: { picture: 'bg' } },
        { name: 'Probe', options: {} },
      ],
      availableSystems: [Background, Probe],
      components: [View],
      globalOptions: {},
      resources: {},
      templateCollection: new TemplateCollection(),
      assets,
      time: new Time(),
    });
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

  it('releases the world set on destroyWorld', async () => {
    await sceneManager.loadWorld();
    await sceneManager.loadScene('scene-1', true);

    sceneManager.destroyWorld();

    expect(events).toEqual(
      expect.arrayContaining(['unload hero', 'unload bg']),
    );
  });
});
