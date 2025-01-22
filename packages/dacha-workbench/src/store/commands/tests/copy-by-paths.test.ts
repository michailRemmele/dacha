import { CopyByPathsCmd } from '../copy-by-paths'
import { Store } from '../../store'
import type { Data } from '../../types'

describe('Store -> Commands -> CopyByPathsCmd', () => {
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
        f: 999,
        d: { c: 123 },
      },
    }
  })

  it('Should correctly copy by paths and cancel movement to array', () => {
    const store = new Store(example)
    const command = new CopyByPathsCmd(store)

    const undo = command.execute({
      sourcePaths: [['a', 'c', 'id:item0'], ['a', 'c', 'id:item1']],
      destinationPath: ['g', 'h'],
    })

    expect((store.get(['g', 'h']) as { id: string }[]).length).toBe(2)
    expect((store.get(['g', 'h', 'id:item0']) as { id: string }).id).toBe('item0')
    expect((store.get(['g', 'h', 'id:item1']) as { id: string }).id).toBe('item1')

    expect(undo).toBeDefined()

    undo?.()

    expect((store.get(['g', 'h']) as { id: string }[]).length).toBe(0)
  })

  it('Should correctly copy by paths and cancel movement to object', () => {
    const store = new Store(example)
    const command = new CopyByPathsCmd(store)

    const undo = command.execute({
      sourcePaths: [['b', 'e'], ['b', 'f'], ['a', 'c', 'id:item0', 'd']],
      destinationPath: ['g'],
    })

    expect(store.get(['g', 'e'])).toBe('abcd')
    expect(store.get(['g', 'f'])).toBe(888)
    expect(store.get(['g', 'd'])).toBe(123)

    expect(undo).toBeDefined()

    undo?.()

    expect(store.get(['g', 'e'])).toBeUndefined()
    expect(store.get(['g', 'f'])).toBe(999)
    expect(store.get(['g', 'd'])).toStrictEqual({ c: 123 })
  })

  it('Should correctly copy by paths and cancel movement objects to object ', () => {
    const store = new Store(example)
    const command = new CopyByPathsCmd(store)

    const undo = command.execute({
      sourcePaths: [['a', 'c', 'id:item0']],
      destinationPath: ['g'],
    })

    expect((store.get(['g', 'id:item0']) as { id: string }).id).toBe('item0')

    expect(undo).toBeDefined()

    undo?.()

    expect(store.get(['g', 'id:item0'])).toBeUndefined()
  })
})
