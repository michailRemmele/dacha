import { CommanderStore } from '../commander-store'
import type { Data } from '../types'
import { DELETE } from '../../command-types'
import { ROOT_SCOPE } from '../../consts/scopes'

describe('CommanderStore', () => {
  it('setWithoutHistory writes the value but records nothing to undo', () => {
    const store = new CommanderStore({ scenes: [], key: 'old' } as unknown as Data)
    store.setWithoutHistory(['key'], 'new')
    expect(store.get(['key'])).toBe('new')
    store.undo({ scope: ROOT_SCOPE })
    expect(store.get(['key'])).toBe('new')
  })

  /*
   * Delete commands capture the parent array by reference for undo, while Store.set copies
   * every node on the write path. So a history-bypassing write landing after a delete leaves
   * that undo entry holding a stale array — undoing it would revert the bypassing write.
   * cleanAll() is what callers of setWithoutHistory use to close that hole.
   */
  it('undo cannot revert a history-bypassing write once cleanAll is called', () => {
    const data = {
      components: [
        { name: 'Camera', config: { zoom: 3 } },
        { name: 'Collider', config: { type: 'box' } },
      ],
    } as unknown as Data
    const store = new CommanderStore(data)

    // The user deletes a component: this undo entry captures the `components` array by reference
    store.dispatch({
      command: DELETE,
      scope: ROOT_SCOPE,
      options: { path: ['components', 'name:Collider'] },
    })
    expect(store.get(['components']) as unknown[]).toHaveLength(1)

    // Reconciliation heals a *sibling* component's config, bypassing history
    store.setWithoutHistory(['components', 'name:Camera', 'config'], { zoom: 3, current: false })
    expect(store.get(['components', 'name:Camera', 'config'])).toEqual({ zoom: 3, current: false })

    store.clean()

    // Undo must not resurrect the pre-heal state
    store.undo({ scope: ROOT_SCOPE })

    expect(store.get(['components', 'name:Camera', 'config'])).toEqual({ zoom: 3, current: false })
  })
})
