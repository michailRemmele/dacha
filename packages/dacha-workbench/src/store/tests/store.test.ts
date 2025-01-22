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

  it('Should correctly copy multiple elements by paths', () => {
    const store = new Store(example)
    const object = store.get([])

    store.copyByPaths(
      [['a', 'c', 'id:item0'], ['a', 'c', 'id:item1']],
      ['a', 'c'],
      (item: unknown) => {
        const copyItem = structuredClone(item) as { id: string }
        copyItem.id = `${copyItem.id}_copy`
        return copyItem
      },
    )

    store.copyByPaths(
      [['b', 'e'], ['b', 'f']],
      ['a', 'c', 'id:item1'],
    )

    expect((store.get(['a', 'c']) as { id: string }[]).length).toBe(4)
    expect((store.get(['a', 'c']) as { id: string }[])[2].id).toBe('item0_copy')
    expect((store.get(['a', 'c']) as { id: string }[])[3].id).toBe('item1_copy')

    expect((store.get(['a', 'c', 'id:item1']) as { e: string; f: number }).e).toBe('abcd')
    expect((store.get(['a', 'c', 'id:item1']) as { e: string; f: number }).f).toBe(888)

    expect((object as { a: { c: Array<unknown> } }).a.c.length).toBe(2)
    expect((object as { a: { c: Array<unknown> } }).a.c[1]).toStrictEqual({
      id: 'item1',
      d: 321,
    })
  })

  it('Should correctly move multiple elements by paths', () => {
    const store = new Store(example)
    const object = store.get([])

    store.moveByPaths(
      [['a', 'c', 'id:item0'], ['a', 'c', 'id:item1']],
      ['g', 'h'],
    )

    expect(store.get(['a', 'c', 'id:item1'])).toBeUndefined()
    expect(store.get(['a', 'c', 'id:item2'])).toBeUndefined()

    expect((store.get(['g', 'h']) as { id: string }[]).length).toBe(2)
    expect((store.get(['g', 'h', 'id:item0']) as { id: string }).id).toBe('item0')
    expect((store.get(['g', 'h', 'id:item1']) as { id: string }).id).toBe('item1')

    expect((object as { a: { c: unknown[] } }).a.c.length).toBe(2)
    expect((object as { g: { h: unknown[] } }).g.h.length).toBe(0)
  })
})
