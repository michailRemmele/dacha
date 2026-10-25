import { Assets } from '../assets';
import { Asset } from '../asset';
import type { AssetConfig } from '../../types';
import { MediaAsset } from '../media-asset';
import { DefineAsset, DefineComponent, DefineField } from '../../decorators';
import { Component } from '../../component';
import { ReferenceWalker } from '../../reference';

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

@DefineComponent({ name: 'Strip' })
class Strip extends Component {
  @DefineField({ type: 'asset', kind: 'sound', multiple: true })
  frames!: string[];
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
      walker: new ReferenceWalker([SoundKind, Bundle]),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const resourceOf = (id: string): string | undefined =>
    assets.get(SoundKind, id)?.resource;

  it('loads what an owner acquires, closed over refs with cycles', async () => {
    assets.register(item('i1', ['i2', 's1']));
    assets.register(item('i2', ['i1']));
    assets.register(sound('s1'));
    const owner = {};

    await assets.acquire(owner, { ids: ['i1'] });

    expect(resourceOf('s1')).toBe('buffer-s1');
  });

  it('acquires every asset of an asset list', async () => {
    const listAssets = new Assets({
      assetClasses: [SoundKind],
      walker: new ReferenceWalker([Strip, SoundKind]),
    });
    listAssets.register(sound('s1'));
    listAssets.register(sound('s2'));

    await listAssets.acquire(
      {},
      {
        actors: [
          {
            id: 'a',
            name: 'a',
            children: [],
            components: [{ name: 'Strip', config: { frames: ['s1', 's2'] } }],
          },
        ],
      },
    );

    expect(listAssets.get(SoundKind, 's1')?.resource).toBe('buffer-s1');
    expect(listAssets.get(SoundKind, 's2')?.resource).toBe('buffer-s2');
  });

  it('skips unknown ids and warns about them', () => {
    void assets.acquire({}, { ids: ['missing'] });

    expect(console.warn).toHaveBeenCalledWith(
      "Can't find asset with the following id: missing",
    );
  });

  it('unloads on release only when no other owner holds the asset', async () => {
    assets.register(sound('s1'));
    const first = {};
    const second = {};
    await assets.acquire(first, { ids: ['s1'] });
    await assets.acquire(second, { ids: ['s1'] });

    assets.release(first);
    expect(resourceOf('s1')).toBe('buffer-s1');

    assets.release(second);
    expect(resourceOf('s1')).toBeUndefined();
  });

  it('replaces the set of an owner that acquires again, keeping shared assets', async () => {
    assets.register(sound('s1'));
    assets.register(sound('s2'));
    const owner = {};
    await assets.acquire(owner, { ids: ['s1', 's2'] });
    const s1 = assets.get(SoundKind, 's1')!;

    await assets.acquire(owner, { ids: ['s2'] });

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
    await assets.acquire(owner, { ids: ['s1'] });

    assets.unregister('s1');

    expect(assets.has('s1')).toBe(false);
    expect(asset.unloaded).toEqual(['buffer-s1']);
  });

  it('register of a known id replaces the instance and unloads the old resource', async () => {
    assets.register(sound('s1'));
    const owner = {};
    await assets.acquire(owner, { ids: ['s1'] });
    const old = assets.get(SoundKind, 's1')!;

    assets.register({ ...sound('s1'), name: 'renamed' });

    expect(assets.get('s1')).not.toBe(old);
    expect(assets.get('s1')!.name).toBe('renamed');
    expect(old.unloaded).toEqual(['buffer-s1']);
    expect(resourceOf('s1')).toBeUndefined();

    await assets.acquire(owner, { ids: ['s1'] });
    assets.release(owner);
    expect(assets.get(SoundKind, 's1')!.unloaded).toEqual(['buffer-s1']);
  });

  it('recomputes refs when an asset is registered again', async () => {
    assets.register(sound('s1'));
    assets.register(sound('s2'));
    assets.register(item('i1', ['s1']));
    assets.register(item('i1', ['s2']));
    const owner = {};

    await assets.acquire(owner, { ids: ['i1'] });

    expect(resourceOf('s1')).toBeUndefined();
    expect(resourceOf('s2')).toBe('buffer-s2');
  });
});
