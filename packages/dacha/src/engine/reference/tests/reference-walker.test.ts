import { Component } from '../../component';
import { WorldSystem } from '../../system';
import { Asset } from '../../asset';
import {
  DefineAsset,
  DefineComponent,
  DefineField,
  DefineSystem,
  DefineBehavior,
} from '../../decorators';
import { Behavior } from '../../../contrib/systems/behavior-system';
import { ReferenceWalker } from '../reference-walker';
import type { Reference } from '../reference-walker';
import type { ActorConfig, SceneConfig, TemplateConfig } from '../../types';

@DefineComponent({ name: 'Picture' })
class Picture extends Component {
  @DefineField({ type: 'asset', kind: 'texture', initialValue: '' })
  texture!: string;
  @DefineField({ type: 'asset', kind: 'texture', name: 'back' })
  backTexture!: string;
}

@DefineComponent({ name: 'Links' })
class Links extends Component {
  @DefineField({ type: 'template' }) prefab!: string;
  @DefineField({ type: 'template', multiple: true }) prefabs!: string[];
  @DefineField({ type: 'scene' }) next!: string;
  @DefineField({ type: 'actor' }) target!: string;
  @DefineField({ type: 'actor', multiple: true }) targets!: string[];
  @DefineField({ type: 'asset', kind: 'texture', multiple: true })
  frames!: string[];
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
  @DefineField({ type: 'template' }) projectile!: string;
}

@DefineSystem({
  name: 'Music',
  fields: [{ name: 'track', type: 'asset', kind: 'audio' }],
})
class Music extends WorldSystem {}

@DefineAsset({ name: 'item' })
class Item extends Asset {
  @DefineField({ type: 'asset', kind: 'texture' }) icon!: string;
  @DefineField({ type: 'template' }) drop!: string;
}

const actor = (
  components: ActorConfig['components'],
  children: ActorConfig[] = [],
  name = 'x',
): ActorConfig => ({ id: name, name, components, children });

describe('ReferenceWalker', () => {
  const walker = new ReferenceWalker([
    Picture,
    Links,
    Scripts,
    Legacy,
    Music,
    Shoot,
    Item,
  ]);

  const visitAll = (
    sources: Parameters<ReferenceWalker['visit']>[0],
  ): Reference[] => {
    const found: Reference[] = [];
    walker.visit(sources, (reference) => {
      found.push(reference);
    });
    return found;
  };

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
      [...walker.collect({ actors: scene.actors }, 'asset')].sort(),
    ).toEqual(['t1', 't2', 't3']);
  });

  it('collects templates', () => {
    const template: TemplateConfig = {
      id: 'tpl',
      name: 'tpl',
      components: [{ name: 'Picture', config: { texture: 't9' } }],
      children: [],
    };

    expect([...walker.collect({ templates: [template] }, 'asset')]).toEqual([
      't9',
    ]);
  });

  it('recurses into script fields through the classes found in dependencies', () => {
    const actors = [
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
    ];

    expect([...walker.collect({ actors }, 'asset')]).toEqual(['snd']);
  });

  it('collects system options', () => {
    expect([
      ...walker.collect(
        {
          systems: [
            { name: 'Music', options: { track: 'm1' } },
            { name: 'Missing', options: { track: 'm2' } },
          ],
        },
        'asset',
      ),
    ]).toEqual(['m1']);
  });

  it('skips components without a schema', () => {
    const actors = [actor([{ name: 'Legacy', config: { texture: 't1' } }])];

    expect(walker.collect({ actors }, 'asset').size).toBe(0);
  });

  it('collects the references in asset data', () => {
    expect(
      walker.collect(
        {
          assets: [
            { id: 'i1', name: 'Sword', kind: 'item', data: { icon: 'tex' } },
          ],
        },
        'asset',
      ),
    ).toEqual(new Set(['tex']));
  });

  it('collects each reference type by its own type only, single and lists', () => {
    const actors = [
      actor([
        {
          name: 'Links',
          config: {
            prefab: 'p1',
            prefabs: ['p2', 'p3'],
            next: 's1',
            target: 'a1',
            targets: ['a2'],
            frames: ['f1', '', 'f2'],
          },
        },
      ]),
    ];

    expect([...walker.collect({ actors }, 'template')].sort()).toEqual([
      'p1',
      'p2',
      'p3',
    ]);
    expect([...walker.collect({ actors }, 'scene')]).toEqual(['s1']);
    expect([...walker.collect({ actors }, 'actor')].sort()).toEqual([
      'a1',
      'a2',
    ]);
    expect([...walker.collect({ actors }, 'asset')].sort()).toEqual([
      'f1',
      'f2',
    ]);
  });

  it('finds references in script options and skips empty values', () => {
    const actors = [
      actor(
        [
          {
            name: 'Scripts',
            config: {
              list: [
                {
                  id: '1',
                  name: 'Shoot',
                  options: { sound: '', projectile: 'bullet' },
                },
              ],
            },
          },
        ],
        [],
        'Player',
      ),
    ];

    expect(visitAll({ actors })).toEqual([{ type: 'template', id: 'bullet' }]);
  });

  it('finds references in asset data', () => {
    expect(
      visitAll({
        assets: [
          {
            id: 'i1',
            name: 'Sword',
            kind: 'item',
            data: { icon: 'tex', drop: 'loot' },
          },
        ],
      }),
    ).toEqual([
      { type: 'asset', id: 'tex' },
      { type: 'template', id: 'loot' },
    ]);
  });

  it('rewrites a value when the visitor returns a new id', () => {
    const config = {
      prefab: 'old',
      prefabs: ['keep', 'old'],
      next: 'other',
    };
    const actors = [actor([{ name: 'Links', config }])];

    walker.visit({ actors }, ({ id }) => (id === 'old' ? 'new' : undefined));

    expect(config).toEqual({
      prefab: 'new',
      prefabs: ['keep', 'new'],
      next: 'other',
    });
  });
});
