import { Assets } from '../assets';
import { Asset } from '../asset';
import type { ActorConfig, AssetConfig, TemplateConfig } from '../../types';
import { MediaAsset } from '../media-asset';
import {
  DefineAsset,
  DefineComponent,
  DefineField,
  DefineSystem,
} from '../../decorators';
import { Component } from '../../component';
import { WorldSystem } from '../../system';
import { ReferenceWalker } from '../../reference';
import { TemplateCollection } from '../../template';

@DefineAsset({ name: 'sound' })
class SoundKind extends MediaAsset<string> {
  unloaded: string[] = [];

  protected fetchResource(): Promise<string> {
    return Promise.resolve(`buffer-${this.id}`);
  }

  protected disposeResource(resource: string): void {
    this.unloaded.push(resource);
  }
}

@DefineAsset({ name: 'texture' })
class TextureKind extends Asset {
  @DefineField() src!: string;
}

@DefineAsset({ name: 'audio' })
class AudioKind extends Asset {
  @DefineField() src!: string;
}

@DefineAsset({ name: 'item' })
class ItemKind extends Asset {
  @DefineField({ initialValue: 0 }) damage!: number;
}

const textureConfig: AssetConfig = {
  id: 'a1',
  name: 'Hero',
  kind: 'texture',
  data: { src: 'img/hero.png' },
};
const audioConfig: AssetConfig = {
  id: 'a2',
  name: 'Jump',
  kind: 'audio',
  data: { src: 'sfx/jump.wav' },
};
const itemConfig: AssetConfig = {
  id: 'a3',
  name: 'Sword',
  kind: 'item',
  data: { damage: 10 },
};

describe('Assets', () => {
  let collection: Assets;

  beforeEach(() => {
    collection = new Assets({
      assetClasses: [TextureKind, AudioKind, ItemKind],
      configs: [textureConfig, audioConfig, itemConfig],
      templates: new TemplateCollection(),
      walker: new ReferenceWalker([TextureKind, AudioKind, ItemKind]),
    });
  });

  it('creates an instance of the kind for every config', () => {
    const asset = collection.get('a1')!;

    expect(asset).toBeInstanceOf(TextureKind);
    expect(asset.name).toBe('Hero');
    expect(collection.get(TextureKind, 'a1')).toBe(asset);
    expect(collection.has('a1')).toBe(true);
  });

  it('returns all assets, or all assets of a kind', () => {
    expect(collection.getAll()).toEqual([
      collection.get('a1'),
      collection.get('a2'),
      collection.get('a3'),
    ]);
    expect(collection.getAll(TextureKind)).toEqual([collection.get('a1')]);
  });

  it('gives undefined for an empty or unknown id without a warning', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => void 0);

    expect(collection.get('')).toBeUndefined();
    expect(collection.get(TextureKind, '')).toBeUndefined();
    expect(collection.get('missing')).toBeUndefined();
    expect(collection.get(TextureKind, 'missing')).toBeUndefined();
    expect(warn).not.toHaveBeenCalled();

    warn.mockRestore();
  });

  it('gives undefined for an asset of another kind', () => {
    expect(collection.get(ItemKind, 'a1')).toBeUndefined();
  });

  it('throws on unknown kind', () => {
    expect(() =>
      collection.register({
        id: 'a4',
        name: 'Mystery',
        kind: 'unknown',
        data: {},
      }),
    ).toThrow("Can't register asset a4. Unknown asset kind: unknown");
  });
});

@DefineAsset({ name: 'bundle' })
class Bundle extends Asset {
  @DefineField({ type: 'asset', kind: 'any' }) first!: string;
  @DefineField({ type: 'asset', kind: 'any' }) second!: string;
}

describe('Assets -> refs and lifecycle', () => {
  const sound = (id: string): AssetConfig => ({
    id,
    name: id,
    kind: 'sound',
    data: {},
  });
  const item = (id: string, refs: string[]): AssetConfig => ({
    id,
    name: id,
    kind: 'bundle',
    data: { first: refs[0] ?? '', second: refs[1] ?? '' },
  });

  let assets: Assets;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => void 0);
    assets = new Assets({
      assetClasses: [SoundKind, Bundle],
      templates: new TemplateCollection(),
      walker: new ReferenceWalker([SoundKind, Bundle]),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const resourceOf = (id: string): string | undefined =>
    assets.get(SoundKind, id)?.resource;

  const flush = (): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, 0));

  it('loads what an owner acquires, closed over refs with cycles', async () => {
    assets.register(item('i1', ['i2', 's1']));
    assets.register(item('i2', ['i1']));
    assets.register(sound('s1'));
    const owner = {};

    await assets.acquire(owner, { assets: ['i1'] });

    expect(resourceOf('s1')).toBe('buffer-s1');
  });

  it('unloads on release only when no other owner holds the asset', async () => {
    assets.register(sound('s1'));
    const first = {};
    const second = {};
    await assets.acquire(first, { assets: ['s1'] });
    await assets.acquire(second, { assets: ['s1'] });

    assets.release(first);
    expect(resourceOf('s1')).toBe('buffer-s1');

    assets.release(second);
    expect(resourceOf('s1')).toBeUndefined();
  });

  it('replaces the set of an owner that acquires again, keeping shared assets', async () => {
    assets.register(sound('s1'));
    assets.register(sound('s2'));
    const owner = {};
    await assets.acquire(owner, { assets: ['s1', 's2'] });
    const s1 = assets.get(SoundKind, 's1')!;

    await assets.acquire(owner, { assets: ['s2'] });

    expect(s1.unloaded).toEqual(['buffer-s1']);
    expect(resourceOf('s2')).toBe('buffer-s2');
  });

  it('ignores release of an owner that holds nothing', () => {
    expect(() => assets.release({})).not.toThrow();
  });

  it('unregister removes the asset and unloads it', async () => {
    assets.register(sound('s1'));
    const asset = assets.get(SoundKind, 's1')!;
    const owner = {};
    await assets.acquire(owner, { assets: ['s1'] });

    assets.unregister('s1');

    expect(assets.has('s1')).toBe(false);
    expect(asset.unloaded).toEqual(['buffer-s1']);
  });

  it('register of a known id replaces the instance and unloads the old resource', async () => {
    assets.register(sound('s1'));
    await assets.acquire({}, { assets: ['s1'] });
    const old = assets.get(SoundKind, 's1')!;

    assets.register({ ...sound('s1'), name: 'renamed' });

    expect(assets.get('s1')).not.toBe(old);
    expect(assets.get('s1')!.name).toBe('renamed');
    expect(old.unloaded).toEqual(['buffer-s1']);
  });

  it('loads an asset registered again while an owner holds it', async () => {
    assets.register(sound('s1'));
    await assets.acquire({}, { assets: ['s1'] });

    assets.register(sound('s1'));
    await flush();

    expect(resourceOf('s1')).toBe('buffer-s1');
  });

  it('does not load an asset registered again that no owner holds', async () => {
    assets.register(sound('s1'));
    const owner = {};
    await assets.acquire(owner, { assets: ['s1'] });
    assets.release(owner);

    assets.register(sound('s1'));
    await flush();

    expect(resourceOf('s1')).toBeUndefined();
  });

  it('keeps the count of every owner through unregister and register', async () => {
    assets.register(sound('s1'));
    const first = {};
    const second = {};
    await assets.acquire(first, { assets: ['s1'] });
    await assets.acquire(second, { assets: ['s1'] });

    assets.unregister('s1');
    assets.register(sound('s1'));
    await assets.acquire(second, { assets: ['s1'] });

    assets.release(first);
    expect(resourceOf('s1')).toBe('buffer-s1');

    assets.release(second);
    expect(resourceOf('s1')).toBeUndefined();
  });

  it('takes a string as the owner', async () => {
    assets.register(sound('s1'));
    await assets.acquire('chapter-2', { assets: ['s1'] });

    expect(resourceOf('s1')).toBe('buffer-s1');

    assets.release('chapter-2');
    expect(resourceOf('s1')).toBeUndefined();
  });

  it('recomputes refs when an asset is registered again', async () => {
    assets.register(sound('s1'));
    assets.register(sound('s2'));
    assets.register(item('i1', ['s1']));
    assets.register(item('i1', ['s2']));
    const owner = {};

    await assets.acquire(owner, { assets: ['i1'] });

    expect(resourceOf('s1')).toBeUndefined();
    expect(resourceOf('s2')).toBe('buffer-s2');
  });
});

@DefineComponent({ name: 'Spawner' })
class Spawner extends Component {
  @DefineField({ type: 'template' }) prefab!: string;
  @DefineField({ type: 'asset', kind: 'sound' }) sound!: string;
}

@DefineAsset({ name: 'waves' })
class Waves extends Asset {
  @DefineField({ type: 'template' }) enemy!: string;
}

@DefineSystem({
  name: 'BossFight',
  fields: [{ name: 'boss', type: 'template' }],
})
class BossFight extends WorldSystem {}

describe('Assets -> templates', () => {
  const template = (
    id: string,
    { sound = '', prefab = '' }: { sound?: string; prefab?: string },
    children: TemplateConfig[] = [],
  ): TemplateConfig => ({
    id,
    name: id,
    components: [{ name: 'Spawner', config: { sound, prefab } }],
    children,
  });
  const actor = (
    templateId: string,
    children: ActorConfig[] = [],
  ): ActorConfig => ({
    id: `actor-${templateId}`,
    name: 'actor',
    templateId,
    components: [],
    children,
  });

  let templates: TemplateCollection;
  let assets: Assets;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => void 0);
    templates = new TemplateCollection();
    assets = new Assets({
      assetClasses: [SoundKind, Waves],
      configs: ['sA', 'sA1', 'sB', 'sC', 'sD'].map((id) => ({
        id,
        name: id,
        kind: 'sound',
        data: {},
      })),
      templates,
      walker: new ReferenceWalker([SoundKind, Waves, Spawner, BossFight]),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const resourceOf = (id: string): string | undefined =>
    assets.get(SoundKind, id)?.resource;

  it('follows template fields recursively and skips unreferenced templates', async () => {
    templates.register(template('A', { sound: 'sA', prefab: 'B' }));
    templates.register(template('B', { sound: 'sB', prefab: 'C' }));
    templates.register(template('C', { sound: 'sC' }));
    templates.register(template('D', { sound: 'sD' }));

    await assets.acquire({}, { actors: [actor('A')] });

    expect(resourceOf('sA')).toBe('buffer-sA');
    expect(resourceOf('sB')).toBe('buffer-sB');
    expect(resourceOf('sC')).toBe('buffer-sC');
    expect(resourceOf('sD')).toBeUndefined();
  });

  it('walks a template cycle once', async () => {
    templates.register(template('B', { sound: 'sB', prefab: 'C' }));
    templates.register(template('C', { sound: 'sC', prefab: 'B' }));

    await assets.acquire({}, { templates: ['B'] });

    expect(resourceOf('sB')).toBe('buffer-sB');
    expect(resourceOf('sC')).toBe('buffer-sC');
  });

  it('follows templateId on child actors to child templates', async () => {
    templates.register(template('A', {}, [template('A1', { sound: 'sA1' })]));

    await assets.acquire({}, { actors: [actor('A', [actor('A1')])] });

    expect(resourceOf('sA1')).toBe('buffer-sA1');
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('follows template fields on template children', async () => {
    templates.register(template('A', {}, [template('A1', { prefab: 'B' })]));
    templates.register(template('B', { sound: 'sB' }));

    await assets.acquire({}, { templates: ['A'] });

    expect(resourceOf('sB')).toBe('buffer-sB');
  });

  it('follows template fields inside asset data', async () => {
    templates.register(template('B', { sound: 'sB' }));
    assets.register({
      id: 'w1',
      name: 'w1',
      kind: 'waves',
      data: { enemy: 'B' },
    });

    await assets.acquire({}, { assets: ['w1'] });

    expect(resourceOf('sB')).toBe('buffer-sB');
  });

  it('follows template fields in system options', async () => {
    templates.register(template('B', { sound: 'sB' }));

    await assets.acquire(
      {},
      { systems: [{ name: 'BossFight', options: { boss: 'B' } }] },
    );

    expect(resourceOf('sB')).toBe('buffer-sB');
  });

  it('warns once about an unknown template id and loads the rest', async () => {
    templates.register(template('A', { sound: 'sA', prefab: 'X' }));

    await assets.acquire({}, { actors: [actor('X'), actor('A')] });

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      "Can't find template with the following id: X",
    );
    expect(resourceOf('sA')).toBe('buffer-sA');
  });

  it('warns once about an unknown asset id referenced twice', async () => {
    templates.register(template('A', { sound: 'gone' }));
    templates.register(template('B', { sound: 'gone' }));

    await assets.acquire({}, { actors: [actor('A'), actor('B')] });

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      "Can't find asset with the following id: gone",
    );
  });

  it('skips empty ids from code without a warning', async () => {
    await assets.acquire({}, { assets: [''], templates: [''] });

    expect(console.warn).not.toHaveBeenCalled();
  });
});
