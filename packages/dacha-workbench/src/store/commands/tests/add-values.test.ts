import { AddValuesCmd } from '../add-values'
import { Store } from '../../store'
import type { Data } from '../../types'

describe('Store -> Commands -> AddValuesCmd', () => {
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

  it('Should correctly copy values to empty array and cancel it', () => {
    const store = new Store(example)
    const command = new AddValuesCmd(store)

    const undo = command.execute({
      values: [
        {
          id: 'item2',
          d: 321,
        },
        {
          id: 'item3',
          d: 654,
        },
      ],
      path: ['g', 'h'],
    })

    expect((store.get(['g', 'h']) as { id: string }[]).length).toBe(2)
    expect((store.get(['g', 'h', 'id:item2']) as { id: string }).id).toBe('item2')
    expect((store.get(['g', 'h', 'id:item3']) as { id: string }).id).toBe('item3')

    expect(undo).toBeDefined()

    undo?.()

    expect((store.get(['g', 'h']) as { id: string }[]).length).toBe(0)
  })

  it('Should correctly copy values to non-empty array and cancel it', () => {
    const store = new Store(example)
    const command = new AddValuesCmd(store)

    const undo = command.execute({
      values: [
        {
          id: 'item2',
          d: 321,
        },
        {
          id: 'item3',
          d: 654,
        },
        {
          id: 'item4',
          d: 987,
        },
      ],
      path: ['a', 'c'],
    })

    expect((store.get(['a', 'c']) as { id: string }[]).length).toBe(5)
    expect((store.get(['a', 'c', 'id:item0']) as { id: string }).id).toBe('item0')
    expect((store.get(['a', 'c', 'id:item4']) as { id: string }).id).toBe('item4')

    expect(undo).toBeDefined()

    undo?.()

    expect((store.get(['a', 'c']) as { id: string }[]).length).toBe(2)
  })
})
