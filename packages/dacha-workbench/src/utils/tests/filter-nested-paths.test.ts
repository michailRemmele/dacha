import { filterNestedPaths } from '../filter-nested-paths'

describe('Utils -> filterNestedPaths()', () => {
  it('Returns filtered paths without nested paths', () => {
    expect(filterNestedPaths([
      ['levels', 'id:1', 'actors', 'id:1.1'],
      ['levels', 'id:1', 'actors', 'id:1.2'],
      ['levels', 'id:1', 'actors', 'id:1.3'],
      ['levels', 'id:1'],
      ['levels', 'id:2'],
      ['levels', 'id:3'],
      ['levels', 'id:4', 'actors', 'id:4.2', 'children', 'id:4.2.2'],
      ['levels', 'id:3', 'actors', 'id:3.1'],
      ['levels', 'id:3', 'actors', 'id:3.2'],
      ['levels', 'id:4', 'actors', 'id:4.1'],
      ['levels', 'id:4', 'actors', 'id:4.2'],
      ['levels', 'id:4', 'actors', 'id:4.2', 'children', 'id:4.2.1'],
    ])).toStrictEqual([
      ['levels', 'id:1'],
      ['levels', 'id:2'],
      ['levels', 'id:3'],
      ['levels', 'id:4', 'actors', 'id:4.1'],
      ['levels', 'id:4', 'actors', 'id:4.2'],
    ])
  })
})
