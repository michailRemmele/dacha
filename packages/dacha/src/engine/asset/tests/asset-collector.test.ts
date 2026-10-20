import { Component } from '../../component';
import { WorldSystem, normalizeSystems } from '../../system';
import { Asset } from '../asset';
import {
  DefineAsset,
  DefineComponent,
  DefineField,
  DefineSystem,
  DefineBehavior,
} from '../../decorators';
import {
  Behavior,
  BehaviorSystem,
} from '../../../contrib/systems/behavior-system';
import { UIBridge } from '../../../contrib/systems/ui-bridge';
import { AssetCollector } from '../asset-collector';
import type { ActorConfig, SceneConfig, TemplateConfig } from '../../types';

@DefineComponent({ name: 'Picture' })
class Picture extends Component {
  @DefineField({ type: 'asset', kind: 'texture', initialValue: '' })
  texture!: string;
  @DefineField({ type: 'asset', kind: 'texture', name: 'back' })
  backTexture!: string;
}

@DefineComponent({ name: 'Scripts' })
class Scripts extends Component {
  @DefineField({ type: 'script', kind: 'behavior', multiple: true })
  list!: { id: string; name: string; options: Record<string, unknown> }[];
}

class Legacy extends Component {
  static componentName = 'Legacy';
}

@DefineBehavior({ name: 'Shoot' })
class Shoot extends Behavior {
  @DefineField({ type: 'asset', kind: 'audio' }) sound!: string;
}

@DefineSystem({
  name: 'Music',
  fields: [{ name: 'track', type: 'asset', kind: 'audio' }],
})
class Music extends WorldSystem {}

@DefineAsset({ name: 'item' })
class Item extends Asset {
  @DefineField({ type: 'asset', kind: 'texture' }) icon!: string;
}

const actor = (
  components: ActorConfig['components'],
  children: ActorConfig[] = [],
): ActorConfig => ({ id: 'x', name: 'x', components, children });

describe('AssetCollector', () => {
  const collector = new AssetCollector({
    components: [Picture, Scripts, Legacy],
    systems: normalizeSystems([
      Music,
      BehaviorSystem.with({ behaviors: [Shoot] }),
      UIBridge.with({
        loadUI: () =>
          Promise.resolve({ onInit: () => void 0, onDestroy: () => void 0 }),
      }),
    ]),
    assets: [Item],
  });

  it('collects asset fields of actors and their children by configuration key', () => {
    const scene: SceneConfig = {
      id: 's',
      name: 's',
      actors: [
        actor(
          [{ name: 'Picture', config: { texture: 't1', back: 't2' } }],
          [actor([{ name: 'Picture', config: { texture: 't3', back: '' } }])],
        ),
      ],
    };

    expect(
      [...collector.collectSources({ actors: scene.actors })].sort(),
    ).toEqual(['t1', 't2', 't3']);
  });

  it('collects templates', () => {
    const template: TemplateConfig = {
      id: 'tpl',
      name: 'tpl',
      components: [{ name: 'Picture', config: { texture: 't9' } }],
      children: [],
    };

    expect([...collector.collectSources({ templates: [template] })]).toEqual([
      't9',
    ]);
  });

  it('recurses into script fields through the classes found in dependencies', () => {
    const scene: SceneConfig = {
      id: 's',
      name: 's',
      actors: [
        actor([
          {
            name: 'Scripts',
            config: {
              list: [
                { id: '1', name: 'Shoot', options: { sound: 'snd' } },
                { id: '2', name: 'Unknown', options: { sound: 'skip' } },
              ],
            },
          },
        ]),
      ],
    };

    expect([...collector.collectSources({ actors: scene.actors })]).toEqual([
      'snd',
    ]);
  });

  it('collects system options', () => {
    expect([
      ...collector.collectSources({
        systems: [
          { name: 'Music', options: { track: 'm1' } },
          { name: 'Missing', options: { track: 'm2' } },
        ],
      }),
    ]).toEqual(['m1']);
  });

  it('skips components without a schema', () => {
    const scene: SceneConfig = {
      id: 's',
      name: 's',
      actors: [actor([{ name: 'Legacy', config: { texture: 't1' } }])],
    };

    expect(collector.collectSources({ actors: scene.actors }).size).toBe(0);
  });

  it('collects the references of an asset without itself', () => {
    expect(
      collector.collectAssetRefs({
        id: 'i1',
        name: 'Sword',
        kind: 'item',
        data: { icon: 'tex' },
      }),
    ).toEqual(new Set(['tex']));
    expect(
      collector.collectAssetRefs({
        id: 'i1',
        name: 'Sword',
        kind: 'item',
        data: { icon: 'i1' },
      }),
    ).toEqual(new Set());
  });

  it('collects listed ids and combines all sources', () => {
    expect(
      [
        ...collector.collectSources({
          ids: ['direct'],
          systems: [{ name: 'Music', options: { track: 'm1' } }],
        }),
      ].sort(),
    ).toEqual(['direct', 'm1']);
  });
});
