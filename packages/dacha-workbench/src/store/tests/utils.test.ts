import { getImmutable } from '../utils'

const example = {
  a: {
    c: [
      {
        name: 'dcba',
        d: 123,
      },
      {
        name: 'abcd',
        d: 321,
      },
    ],
  },
  b: {
    e: 'abcd',
    f: 888,
  },
}

describe('Store -> utils -> getImmutable()', () => {
  it('Returns object and creates copies of objects and arrays', () => {
    const exampleCopy = { ...example }
    const object = getImmutable(example.a, ['c', 'name:abcd'], example, 'a')

    expect(object).toStrictEqual({
      name: 'abcd',
      d: 321,
    })

    expect(exampleCopy.a).not.toBe(example.a)
    expect(exampleCopy.a.c).not.toBe(example.a.c)
    expect(exampleCopy.a.c[1]).not.toBe(example.a.c[1])

    expect(exampleCopy.a.c[0]).toBe(example.a.c[0])
    expect(exampleCopy.b).toBe(example.b)
  })

  it('Returns number and creates copies of objects and arrays', () => {
    const exampleCopy = { ...example }
    const value = getImmutable(example.a, ['c', 'name:dcba', 'd'], example, 'a')

    expect(value).toBe(123)

    expect(exampleCopy.a).not.toBe(example.a)
    expect(exampleCopy.a.c).not.toBe(example.a.c)
    expect(exampleCopy.a.c[0]).not.toBe(example.a.c[0])

    expect(exampleCopy.a.c[1]).toBe(example.a.c[1])
    expect(exampleCopy.b).toBe(example.b)
  })
})
