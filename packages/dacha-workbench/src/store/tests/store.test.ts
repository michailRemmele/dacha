import { Store } from '../store'
import type { Data } from '../types'

describe('Store', () => {
  let example: Data

  beforeEach(() => {
    example = {
      a: {
        c: [
          {
            id: 'item0',
            d: 123,
          },
          {
            id: 'item1',
            d: 321,
          },
        ],
      },
      b: {
        e: 'abcd',
        f: 888,
      },
      g: {
        h: [],
      },
    }
  })

  it('Should correctly immutable change of nested object value', () => {
    const store = new Store(example)
    const object = store.get(['a']) as Record<string, unknown>

    store.set(['a', 'c', 'id:item0', 'd'], 648)

    expect(store.get(['a', 'c', 'id:item0', 'd'])).toBe(648)

    expect(store.get(['a'])).not.toBe(object)
    expect(store.get(['a', 'c'])).not.toBe(object.c)
    expect(store.get(['a', 'c', 'id:item0'])).not.toBe((object.c as unknown[])[0])
  })

  it('Should correctly immutable change of nested array item', () => {
    const store = new Store(example)
    const object = store.get(['a']) as Record<string, unknown>

    store.set(['a', 'c', 'id:item0'], { id: 'item2', d: 648 })

    expect(store.get(['a', 'c', 'id:item0'])).toBeUndefined()
    expect(store.get(['a', 'c', 'id:item2', 'id'])).toBe('item2')
    expect(store.get(['a', 'c', 'id:item2', 'd'])).toBe(648)

    expect(store.get(['a'])).not.toBe(object)
    expect(store.get(['a', 'c'])).not.toBe(object.c)
    expect(store.get(['a', 'c', 'id:item2'])).not.toBe((object.c as unknown[])[1])
  })

  it('Should correctly immutable delete nested item', () => {
    const store = new Store(example)
    const object = store.get([])

    store.delete(['a', 'c', 'id:item1'])

    expect(store.get(['a', 'c', 'id:item1'])).toBeUndefined()
    expect((store.get(['a', 'c']) as unknown[]).length).toBe(1)

    store.delete(['b'])

    expect(store.get(['b'])).toBeUndefined()

    expect((object as { b: unknown }).b).toBeDefined()
    expect((object as { a: { c: unknown[] } }).a.c.length).toBe(2)
  })

  it('Should correctly immutable delete multiple items by paths', () => {
    const store = new Store(example)
    const object = store.get([])

    store.deleteByPaths([['a', 'c', 'id:item1'], ['b'], ['a', 'c']])

    expect(store.get(['a', 'c', 'id:item1'])).toBeUndefined()
    expect(store.get(['a', 'c'])).toBeUndefined()
    expect(store.get(['b'])).toBeUndefined()

    expect((object as { a: { c: unknown[] } }).a.c).toBeDefined()
    expect((object as { a: { c: unknown[] } }).a.c.length).toBe(2)
    expect((object as { b: unknown }).b).toBeDefined()
  })

  it('Should correctly immutable delete single item by paths', () => {
    const store = new Store(example)
    const object = store.get([])

    store.deleteByPaths([['a', 'c', 'id:item1']])

    expect(store.get(['a', 'c', 'id:item1'])).toBeUndefined()
    expect((object as { a: { c: unknown[] } }).a.c.length).toBe(2)
  })

  it('Notifies the shared array when deleting several of its items', () => {
    const store = new Store({ assets: [{ id: 'x' }, { id: 'y' }, { id: 'z' }] })
    const listener = jest.fn()
    store.subscribe(listener)

    store.deleteByPaths([['assets', 'id:x'], ['assets', 'id:y']])

    expect(store.get(['assets'])).toEqual([{ id: 'z' }])
    expect(listener).toHaveBeenCalledWith(['assets'], [{ id: 'z' }])
  })

  it('Notifies the parent array when deleting a single item by paths', () => {
    const store = new Store(example)
    const listener = jest.fn()
    store.subscribe(listener)

    store.deleteByPaths([['a', 'c', 'id:item1']])

    expect(listener.mock.calls[0][0]).toEqual(['a', 'c'])
  })

  it('Deletes an item together with its own descendant', () => {
    const store = new Store({
      actors: [{ id: 'p', children: [{ id: 'c' }] }, { id: 'q', children: [] }],
    })

    store.deleteByPaths([
      ['actors', 'id:p'],
      ['actors', 'id:p', 'children', 'id:c'],
    ])

    expect(store.get(['actors'])).toEqual([{ id: 'q', children: [] }])
  })

  it('Finds items whose id contains the key delimiter', () => {
    const store = new Store({ list: [{ id: 'a:b', v: 1 }] })

    store.set(['list', 'id:a:b', 'v'], 2)

    expect(store.get(['list', 'id:a:b', 'v'])).toBe(2)
  })

  it('Leaves an array alone and does not notify for a key it cannot find', () => {
    const store = new Store({ list: [{ id: 'a' }, { id: 'b' }] })
    const listener = jest.fn()
    store.subscribe(listener)

    store.delete(['list', 'missing'])
    store.delete(['list', 'id:missing'])
    store.set(['list', '5'], { id: 'c' })

    expect(store.get(['list'])).toEqual([{ id: 'a' }, { id: 'b' }])
    expect(listener).not.toHaveBeenCalled()
  })

  it('Replaces the whole data when setting the root path', () => {
    const store = new Store(example)

    store.set([], { x: 1 })

    expect(store.get([])).toEqual({ x: 1 })
  })

  it('Gives undefined for a path through a null value', () => {
    const store = new Store({ a: null } as unknown as Data)

    expect(store.get(['a', 'b'])).toBeUndefined()
  })
})
