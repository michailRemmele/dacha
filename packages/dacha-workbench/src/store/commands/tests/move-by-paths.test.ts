import { MoveByPathsCmd } from '../move-by-paths'
import { Store } from '../../store'
import type { Data } from '../../types'

describe('Store -> Commands -> MoveByPathsCmd', () => {
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
        h: [
          {
            id: 'item2',
            d: 456,
          },
        ],
      },
      b: {
        e: 'abcd',
        f: 888,
      },
      g: {
        h: [],
        f: 999,
        d: { c: 123 },
      },
    }
  })

  it('Should correctly move by paths and cancel movement to array', () => {
    const store = new Store(example)
    const command = new MoveByPathsCmd(store)

    const undo = command.execute({
      sourcePaths: [['a', 'c', 'id:item0'], ['a', 'c', 'id:item1']],
      destinationPath: ['g', 'h'],
    })

    expect(store.get(['a', 'c', 'id:item0'])).toBeUndefined()
    expect(store.get(['a', 'c', 'id:item1'])).toBeUndefined()

    expect((store.get(['g', 'h']) as { id: string }[]).length).toBe(2)
    expect((store.get(['g', 'h', 'id:item0']) as { id: string }).id).toBe('item0')
    expect((store.get(['g', 'h', 'id:item1']) as { id: string }).id).toBe('item1')

    expect(undo).toBeDefined()

    undo?.()

    expect((store.get(['g', 'h']) as { id: string }[]).length).toBe(0)

    expect((store.get(['a', 'c']) as { id: string }[]).length).toBe(2)
    expect((store.get(['a', 'c', 'id:item0']) as { id: string }).id).toBe('item0')
    expect((store.get(['a', 'c', 'id:item1']) as { id: string }).id).toBe('item1')
  })

  it('Should correctly move by paths and cancel movement to object', () => {
    const store = new Store(example)
    const command = new MoveByPathsCmd(store)

    const undo = command.execute({
      sourcePaths: [['b', 'e'], ['b', 'f'], ['a', 'c', 'id:item0', 'd']],
      destinationPath: ['g'],
    })

    expect(store.get(['b', 'e'])).toBeUndefined()
    expect(store.get(['b', 'f'])).toBeUndefined()
    expect(store.get(['a', 'c', 'id:item0', 'd'])).toBeUndefined()

    expect(store.get(['g', 'e'])).toBe('abcd')
    expect(store.get(['g', 'f'])).toBe(888)
    expect(store.get(['g', 'd'])).toBe(123)

    expect(undo).toBeDefined()

    undo?.()

    expect(store.get(['b', 'e'])).toBe('abcd')
    expect(store.get(['b', 'f'])).toBe(888)
    expect(store.get(['a', 'c', 'id:item0', 'd'])).toBe(123)

    expect(store.get(['g', 'e'])).toBeUndefined()
    expect(store.get(['g', 'f'])).toBe(999)
    expect(store.get(['g', 'd'])).toStrictEqual({ c: 123 })
  })

  it('Should correctly move by paths and cancel movement objects to object ', () => {
    const store = new Store(example)
    const command = new MoveByPathsCmd(store)

    const undo = command.execute({
      sourcePaths: [['a', 'c', 'id:item0']],
      destinationPath: ['g'],
    })

    expect(store.get(['a', 'c', 'id:item0'])).toBeUndefined()

    expect((store.get(['g', 'id:item0']) as { id: string }).id).toBe('item0')

    expect(undo).toBeDefined()

    undo?.()

    expect((store.get(['a', 'c']) as { id: string }[]).length).toBe(2)
    expect((store.get(['a', 'c', 'id:item0']) as { id: string }).id).toBe('item0')

    expect(store.get(['g', 'id:item0'])).toBeUndefined()
  })

  it('Should correctly move by paths and cancel movement objects to array (destination is one of sources parent)', () => {
    const store = new Store(example)
    const command = new MoveByPathsCmd(store)

    const undo = command.execute({
      sourcePaths: [['a', 'c', 'id:item0'], ['a', 'h', 'id:item2']],
      destinationPath: ['a', 'c'],
    })

    expect((store.get(['a', 'c']) as { id: string }[]).length).toBe(3)
    expect((store.get(['a', 'h']) as { id: string }[]).length).toBe(0)

    expect(undo).toBeDefined()

    undo?.()

    expect((store.get(['a', 'c']) as { id: string }[]).length).toBe(2)
    expect((store.get(['a', 'h']) as { id: string }[]).length).toBe(1)
  })
})
