import type { AssetConfig } from 'dacha';

import { AssetsWatcher } from '../assets-watcher';

const texture = (id: string, src: string): AssetConfig => ({
  id,
  name: id,
  kind: 'texture',
  data: { src },
});

type AssetsMock = Record<
  'register' | 'unregister' | 'hasKind' | 'acquire',
  jest.Mock
>;

const createAssets = (): AssetsMock => ({
  register: jest.fn(),
  unregister: jest.fn(),
  hasKind: jest.fn((kind: string) => kind === 'texture'),
  acquire: jest.fn(() => Promise.resolve()),
});

interface StoreMock {
  get: jest.Mock;
  put: (configs: AssetConfig[]) => void;
}

// Stands for the project store: `put` replaces the `assets` section.
const createStore = (configs: AssetConfig[]): StoreMock => {
  let current = configs;
  return {
    get: jest.fn(() => current),
    put: (next: AssetConfig[]): void => {
      current = next;
    },
  };
};

describe('AssetsWatcher', () => {
  it('registers known kinds on creation and skips unknown ones', () => {
    const assets = createAssets();
    const tileset: AssetConfig = {
      id: 'x',
      name: 'x',
      kind: 'tileset',
      data: {},
    };

    new AssetsWatcher({
      store: createStore([texture('a', 'a.png'), tileset]),
      assets,
    });

    expect(assets.register).toHaveBeenCalledTimes(1);
    expect(assets.register).toHaveBeenCalledWith(texture('a', 'a.png'));
  });

  it('ignores changes outside the assets section', () => {
    const assets = createAssets();
    const store = createStore([texture('a', 'a.png')]);
    const watcher = new AssetsWatcher({ store, assets });
    store.put([]);

    watcher.handle(['scenes', 'id:s']);

    expect(assets.unregister).not.toHaveBeenCalled();
  });

  it('registers again only configs that changed by reference', () => {
    const assets = createAssets();
    const a = texture('a', 'a.png');
    const store = createStore([a, texture('b', 'b.png')]);
    const watcher = new AssetsWatcher({ store, assets });
    assets.register.mockClear();

    const changed = texture('b', 'c.png');
    store.put([a, changed]);
    watcher.handle(['assets', 'id:b', 'data', 'src']);

    expect(assets.register).toHaveBeenCalledTimes(1);
    expect(assets.register).toHaveBeenCalledWith(changed);
  });

  it('unregisters removed assets it registered and nothing else', () => {
    const assets = createAssets();
    const store = createStore([texture('a', 'a.png')]);
    const watcher = new AssetsWatcher({ store, assets });

    store.put([]);
    watcher.handle(['assets']);

    expect(assets.unregister).toHaveBeenCalledTimes(1);
    expect(assets.unregister).toHaveBeenCalledWith('a');
  });

  it('acquires the full set as one owner on every change', () => {
    const assets = createAssets();
    const store = createStore([texture('a', 'a.png'), texture('b', 'b.png')]);
    const watcher = new AssetsWatcher({ store, assets });
    expect(assets.acquire).toHaveBeenCalledWith(watcher, { ids: ['a', 'b'] });

    store.put([texture('a', 'c.png')]);
    watcher.handle(['assets']);

    expect(assets.acquire).toHaveBeenCalledTimes(2);
    expect(assets.acquire).toHaveBeenLastCalledWith(watcher, { ids: ['a'] });
  });
});
