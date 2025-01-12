import { Store } from '../store'
import type { Data } from '../types'

describe('Mutator -> Store', () => {
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
    }
  })

  it('Should correctly immutable change of nested object value', () => {
    const store = new Store(example)
    const object = store.get(['a']) as Record<string, unknown>

    store.set(['a', 'c', 'id:item0', 'd'], 648)

    expect(store.get(['a', 'c', 'id:item0', 'd'])).toBe(648)

    expect(store.get(['a'])).not.toBe(object)
    expect(store.get(['a', 'c'])).not.toBe(object.c)
    expect(store.get(['a', 'c', 'id:item0'])).not.toBe((object.c as Array<unknown>)[0])
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
    expect(store.get(['a', 'c', 'id:item2'])).not.toBe((object.c as Array<unknown>)[1])
  })

  it('Should correctly immutable delete nested item', () => {
    const store = new Store(example)
    const object = store.get([])

    store.delete(['a', 'c', 'id:item1'])

    expect(store.get(['a', 'c', 'id:item1'])).toBeUndefined()
    expect((store.get(['a', 'c']) as Array<unknown>).length).toBe(1)

    store.delete(['b'])

    expect(store.get(['b'])).toBeUndefined()

    expect((object as { b: unknown }).b).toBeDefined()
    expect((object as { a: { c: Array<unknown> } }).a.c.length).toBe(2)
  })

  it('Should correctly immutable delete multiple items by paths', () => {
    const store = new Store(example)
    const object = store.get([])

    store.deleteByPaths([['a', 'c', 'id:item1'], ['b'], ['a', 'c']])

    expect(store.get(['a', 'c', 'id:item1'])).toBeUndefined()
    expect(store.get(['a', 'c'])).toBeUndefined()
    expect(store.get(['b'])).toBeUndefined()

    expect((object as { a: { c: Array<unknown> } }).a.c).toBeDefined()
    expect((object as { a: { c: Array<unknown> } }).a.c.length).toBe(2)
    expect((object as { b: unknown }).b).toBeDefined()
  })

  it('Should correctly immutable delete single item by paths', () => {
    const store = new Store(example)
    const object = store.get([])

    store.deleteByPaths([['a', 'c', 'id:item1']])

    expect(store.get(['a', 'c', 'id:item1'])).toBeUndefined()
    expect((object as { a: { c: Array<unknown> } }).a.c.length).toBe(2)
  })
})
