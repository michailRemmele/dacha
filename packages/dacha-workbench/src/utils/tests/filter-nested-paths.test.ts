import { filterNestedPaths } from '../filter-nested-paths'

describe('Utils -> filterNestedPaths()', () => {
  it('Returns filtered paths without nested paths', () => {
    expect(filterNestedPaths([
      ['scenes', 'id:1', 'actors', 'id:1.1'],
      ['scenes', 'id:1', 'actors', 'id:1.2'],
      ['scenes', 'id:1', 'actors', 'id:1.3'],
      ['scenes', 'id:1'],
      ['scenes', 'id:2'],
      ['scenes', 'id:3'],
      ['scenes', 'id:4', 'actors', 'id:4.2', 'children', 'id:4.2.2'],
      ['scenes', 'id:3', 'actors', 'id:3.1'],
      ['scenes', 'id:3', 'actors', 'id:3.2'],
      ['scenes', 'id:4', 'actors', 'id:4.1'],
      ['scenes', 'id:4', 'actors', 'id:4.2'],
      ['scenes', 'id:4', 'actors', 'id:4.2', 'children', 'id:4.2.1'],
    ])).toStrictEqual([
      ['scenes', 'id:1'],
      ['scenes', 'id:2'],
      ['scenes', 'id:3'],
      ['scenes', 'id:4', 'actors', 'id:4.1'],
      ['scenes', 'id:4', 'actors', 'id:4.2'],
    ])
  })
})
