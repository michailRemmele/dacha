import { Store } from '../store'

const example = {
  a: {
    c: [
      {
        name: '00',
        d: 123,
      },
      {
        name: '01',
        d: 321,
      },
    ],
  },
  b: {
    e: 'abcd',
    f: 888,
  },
}

describe('Mutator -> Store', () => {
  it('Should does correctly immutable change of nested object value', () => {
    const store = new Store(example)
    const object = store.get(['a']) as Record<string, unknown>

    store.set(['a', 'c', '00', 'd'], 648)

    expect(store.get(['a', 'c', '00', 'd'])).toBe(648)

    expect(store.get(['a'])).not.toBe(object)
    expect(store.get(['a', 'c'])).not.toBe(object.c)
    expect(store.get(['a', 'c', '00'])).not.toBe((object.c as Array<unknown>)[0])
  })
})
