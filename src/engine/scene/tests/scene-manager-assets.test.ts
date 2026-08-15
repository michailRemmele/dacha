import { SceneManager } from '../scene-manager';
import { WorldSystem, SceneSystem } from '../../system';
import type { WorldSystemOptions, SceneSystemOptions } from '../../system';
import { TemplateCollection } from '../../template';
import { Assets } from '../../asset';
import { Texture } from '../../../contrib/assets';
import { Time } from '../../time';

import { getSceneConfigMock } from './mocks/scene-config.mock';
import { getSystemConfigMock } from './mocks/system-config.mock';

let worldSystemAssets: Assets | undefined;
let sceneSystemAssets: Assets | undefined;

class AssetsWorldSystem extends WorldSystem {
  constructor(options: WorldSystemOptions) {
    super();
    worldSystemAssets = options.assets;
  }
}
AssetsWorldSystem.systemName = 'assets-world-system';

class AssetsSceneSystem extends SceneSystem {
  constructor(options: SceneSystemOptions) {
    super();
    sceneSystemAssets = options.assets;
  }
}
AssetsSceneSystem.systemName = 'assets-scene-system';

describe('SceneManager -> assets', () => {
  let assets: Assets;

  beforeEach(() => {
    worldSystemAssets = undefined;
    sceneSystemAssets = undefined;

    assets = new Assets([Texture]);
    assets.register({
      id: 'a1',
      name: 'Hero',
      kind: 'texture',
      data: { src: 'img/hero.png' },
    });
  });

  it('passes the asset registry to world and scene systems', async () => {
    const sceneManager = new SceneManager({
      sceneConfigs: [getSceneConfigMock('scene-1')],
      systemConfigs: [
        getSystemConfigMock('assets-world-system'),
        getSystemConfigMock('assets-scene-system'),
      ],
      availableSystems: [AssetsWorldSystem, AssetsSceneSystem],
      components: [],
      globalOptions: {},
      resources: {},
      templateCollection: new TemplateCollection(),
      assets,
      time: new Time(),
    });

    expect(worldSystemAssets).toBe(assets);

    await sceneManager.loadWorld();
    await sceneManager.loadScene('scene-1', true);

    expect(sceneSystemAssets).toBe(assets);
    expect(sceneSystemAssets?.get('a1', Texture).src).toBe('img/hero.png');
  });
});
