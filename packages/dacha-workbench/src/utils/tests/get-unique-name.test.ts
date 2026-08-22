import { getUniqueName } from '../get-unique-name'

describe('Utils -> getUniqueName()', () => {
  it('Returns unique name', () => {
    const parent = [
      { name: 'abc' },
      { name: 'abc 1' },
      { name: 'abc 10' },
      { name: 'abc 20' },
      { name: 'abc 000303' },
      { name: 'cba1' },
    ]

    expect(getUniqueName('abc', parent)).toBe('abc 2')
    expect(getUniqueName('abc 1', parent)).toBe('abc 2')
    expect(getUniqueName('abc 2', parent)).toBe('abc 2')
    expect(getUniqueName('abc 20', parent)).toBe('abc 21')
    expect(getUniqueName('abc 303', parent)).toBe('abc 303')
    expect(getUniqueName('abc 000303', parent)).toBe('abc 304')

    expect(getUniqueName('cba', parent)).toBe('cba')
  })
})
