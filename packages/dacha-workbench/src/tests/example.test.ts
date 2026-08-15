const doSomeWork = (a: number, b: number): number => a + b

describe('Example -> doSomeWork()', () => {
  it('Returns sum of two args', () => {
    expect(doSomeWork(1, 6)).toBe(7)
  })
})
