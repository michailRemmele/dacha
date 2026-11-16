import { CommanderStore } from '../commander-store';
import type { Data } from '../types';
import { DELETE, DELETE_BY_PATHS, SET } from '../../command-types';
import { ROOT_SCOPE } from '../../consts/scopes';

describe('CommanderStore', () => {
  it('assign writes the value but records nothing to undo', () => {
    const store = new CommanderStore({
      scenes: [],
      key: 'old',
    } as unknown as Data);
    store.assign(['key'], 'new');
    expect(store.get(['key'])).toBe('new');
    store.undo({ scope: ROOT_SCOPE });
    expect(store.get(['key'])).toBe('new');
  });

  /*
   * Delete commands capture the parent array by reference for undo, while Store.set copies
   * every node on the write path. So a history-bypassing write landing after a delete leaves
   * that undo entry holding a stale array — undoing it would revert the bypassing write.
   * cleanAll() is what callers of assign use to close that hole.
   */
  it('undo cannot revert a history-bypassing write once cleanAll is called', () => {
    const data = {
      components: [
        { name: 'Camera', config: { zoom: 3 } },
        { name: 'Collider', config: { type: 'box' } },
      ],
    } as unknown as Data;
    const store = new CommanderStore(data);

    // The user deletes a component: this undo entry captures the `components` array by reference
    store.dispatch({
      command: DELETE,
      scope: ROOT_SCOPE,
      options: { path: ['components', 'name:Collider'] },
    });
    expect(store.get(['components']) as unknown[]).toHaveLength(1);

    // Reconciliation heals a *sibling* component's config, bypassing history
    store.assign(['components', 'name:Camera', 'config'], {
      zoom: 3,
      current: false,
    });
    expect(store.get(['components', 'name:Camera', 'config'])).toEqual({
      zoom: 3,
      current: false,
    });

    store.clear();

    // Undo must not resurrect the pre-heal state
    store.undo({ scope: ROOT_SCOPE });

    expect(store.get(['components', 'name:Camera', 'config'])).toEqual({
      zoom: 3,
      current: false,
    });
  });

  it('undo restores several deleted items', () => {
    const store = new CommanderStore({
      assets: [{ id: 'x' }, { id: 'y' }],
      templates: [{ id: 't' }],
    } as unknown as Data);

    store.dispatch({
      command: DELETE_BY_PATHS,
      scope: ROOT_SCOPE,
      options: { paths: [['assets', 'id:x'], ['templates', 'id:t']] },
    });
    expect(store.get(['assets'])).toEqual([{ id: 'y' }]);
    expect(store.get(['templates'])).toEqual([]);

    store.undo({ scope: ROOT_SCOPE });

    expect(store.get(['assets'])).toEqual([{ id: 'x' }, { id: 'y' }]);
    expect(store.get(['templates'])).toEqual([{ id: 't' }]);
  });

  it('undo and redo notify listeners once the whole operation is applied', () => {
    const store = new CommanderStore({ a: 0, b: 0 } as unknown as Data);
    store.dispatch({ command: SET, scope: ROOT_SCOPE, options: { path: ['a'], value: 1 } });
    store.dispatch({
      command: SET,
      scope: ROOT_SCOPE,
      isEffect: true,
      options: { path: ['b'], value: 1 },
    });

    const seen: unknown[] = [];
    store.subscribe((path) => seen.push([path[0], store.get(['a']), store.get(['b'])]));

    store.undo({ scope: ROOT_SCOPE });
    expect(seen).toEqual([
      ['b', 0, 0],
      ['a', 0, 0],
    ]);

    seen.length = 0;
    store.redo({ scope: ROOT_SCOPE });
    expect(seen).toEqual([
      ['a', 1, 1],
      ['b', 1, 1],
    ]);
  });
});
