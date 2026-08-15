import { Assets } from '../assets';
import { Asset } from '../asset';
import type { AssetOptions } from '../asset';
import type { AssetConfig } from '../../types';

interface FileData {
  src?: string;
}

interface ItemData {
  damage?: number;
}

class TextureKind extends Asset {
  src: string;

  constructor(options: AssetOptions<FileData>) {
    super(options);

    this.src = options.data.src ?? '';
  }
}
TextureKind.assetName = 'texture';

class AudioKind extends Asset {
  src: string;

  constructor(options: AssetOptions<FileData>) {
    super(options);

    this.src = options.data.src ?? '';
  }
}
AudioKind.assetName = 'audio';

class ItemKind extends Asset {
  damage: number;

  constructor(options: AssetOptions<ItemData>) {
    super(options);

    this.damage = options.data.damage ?? 0;
  }
}
ItemKind.assetName = 'item';

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
    collection = new Assets([TextureKind, AudioKind, ItemKind]);
    [textureConfig, audioConfig, itemConfig].forEach((config) =>
      collection.register(config),
    );
  });

  it('instantiates the class of the registered kind', () => {
    const asset = collection.get('a1');

    expect(asset).toBeInstanceOf(TextureKind);
    expect(asset.id).toBe('a1');
    expect(asset.name).toBe('Hero');
    expect((asset as TextureKind).src).toBe('img/hero.png');
    expect(collection.has('a1')).toBe(true);
  });

  it('returns a typed instance when given the asset class', () => {
    const texture = collection.get('a1', TextureKind);
    const item = collection.get('a3', ItemKind);

    expect(texture.src).toBe('img/hero.png');
    expect(item.damage).toBe(10);
  });

  it('returns the same instance on every lookup', () => {
    expect(collection.get('a1')).toBe(collection.get('a1'));
  });

  it('returns all assets of a given kind', () => {
    expect(collection.getAll(TextureKind)).toEqual([collection.get('a1')]);
    expect(collection.getAll(ItemKind)).toEqual([collection.get('a3')]);
  });

  it('returns every asset', () => {
    expect(collection.getAll()).toEqual([
      collection.get('a1'),
      collection.get('a2'),
      collection.get('a3'),
    ]);
  });

  it('throws on unknown id', () => {
    expect(() => collection.get('missing')).toThrow(
      "Can't find asset with the following id: missing",
    );
  });

  it('throws when the asset is of another kind', () => {
    expect(() => collection.get('a1', ItemKind)).toThrow(
      'Asset a1 is not an instance of item kind',
    );
  });

  it('throws on duplicate id', () => {
    expect(() => collection.register(textureConfig)).toThrow(
      'Asset with the following id is already registered: a1',
    );
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

  it('returns an empty list for a kind with no assets', () => {
    const empty = new Assets([TextureKind]);

    expect(empty.getAll(TextureKind)).toEqual([]);
    expect(empty.getAll()).toEqual([]);
  });
});
