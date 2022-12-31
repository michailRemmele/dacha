import { nextImmutable } from '../utils'

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

describe('Mutator -> utils -> nextImmutable()', () => {
  it('Returns object and creates copies of objects and arrays', () => {
    const exampleCopy = { ...example }
    const object = nextImmutable(example.a, ['c', '01'], example, 'a')

    expect(object).toStrictEqual({
      name: '01',
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
    const value = nextImmutable(example.a, ['c', '00', 'd'], example, 'a')

    expect(value).toBe(123)

    expect(exampleCopy.a).not.toBe(example.a)
    expect(exampleCopy.a.c).not.toBe(example.a.c)
    expect(exampleCopy.a.c[0]).not.toBe(example.a.c[0])

    expect(exampleCopy.a.c[1]).toBe(example.a.c[1])
    expect(exampleCopy.b).toBe(example.b)
  })
})
