import { CacheStore } from '../cache-store';

describe('Engine -> DataLib -> CacheStore', () => {
  it('Keep values in store until their release', () => {
    const store = new CacheStore<number>();

    store.add('field-1', 1);
    store.add('field-2', 2);
    store.add('field-3', 3);

    expect(store.has('field-1')).toBeTruthy();
    expect(store.has('field-2')).toBeTruthy();
    expect(store.has('field-3')).toBeTruthy();

    store.retain('field-1');
    store.retain('field-1');
    store.retain('field-2');

    store.release('field-1');
    store.release('field-2');
    store.release('field-3');

    store.cleanReleased();

    expect(store.has('field-1')).toBeTruthy();
    expect(store.has('field-2')).toBeFalsy();
    expect(store.has('field-3')).toBeFalsy();

    store.release('field-1');

    store.cleanReleased();

    expect(store.has('field-1')).toBeFalsy();
  });
});
