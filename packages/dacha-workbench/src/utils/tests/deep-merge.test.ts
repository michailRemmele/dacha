import { deepMerge } from '../deep-merge'

describe('Utils -> deepMerge()', () => {
  it('Returns merged object', () => {
    expect(deepMerge(
      { a: '1', b: { c: 'd' }, c: 'd' },
      { b: { d: 'e' }, c: 'e' },
    )).toStrictEqual({
      a: '1', b: { c: 'd', d: 'e' }, c: 'e',
    })
  })
})
