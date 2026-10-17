import { CacheStore } from '..';

describe('Contrib -> Renderer -> CacheStore', () => {
  it('keeps a value while it has references', () => {
    const store = new CacheStore<number>();

    store.add('key', 1);
    store.retain('key');
    store.retain('key');
    store.release('key');

    expect(store.has('key')).toBe(true);
    expect(store.get('key')).toBe(1);
  });

  it('drops a value when its last reference is released', () => {
    const store = new CacheStore<number>();

    store.add('key', 1);
    store.retain('key');
    store.release('key');

    expect(store.has('key')).toBe(false);
    expect(store.get('key')).toBeUndefined();
  });

  it('drops a value that is released without being retained', () => {
    const store = new CacheStore<number>();

    store.add('key', 1);
    store.release('key');

    expect(store.has('key')).toBe(false);
  });

  it('ignores retain and release of a missing key', () => {
    const store = new CacheStore<number>();

    expect(() => {
      store.retain('missing');
      store.release('missing');
    }).not.toThrow();
  });
});
