import type { Field } from '../../../../../../types/widget-schema';
import { groupFields } from '../group-fields';

const field = (overrides: Partial<Field> & { name: string }): Field =>
  ({ type: 'string', ...overrides }) as Field;

describe('groupFields', () => {
  it('returns unsectioned fields flat, unchanged', () => {
    const fields = [field({ name: 'a' }), field({ name: 'b' })];

    expect(groupFields(fields)).toEqual([
      { kind: 'field', field: fields[0] },
      { kind: 'field', field: fields[1] },
    ]);
  });

  it('groups contiguous fields sharing the same section', () => {
    const a = field({ name: 'a' });
    const b = field({ name: 'b', section: 'Physics' });
    const c = field({ name: 'c', section: 'Physics' });
    const d = field({ name: 'd' });

    expect(groupFields([a, b, c, d])).toEqual([
      { kind: 'field', field: a },
      { kind: 'section', section: 'Physics', fields: [b, c] },
      { kind: 'field', field: d },
    ]);
  });

  it('treats a section name repeated non-adjacently as two separate sections', () => {
    const a = field({ name: 'a', section: 'Physics' });
    const b = field({ name: 'b' });
    const c = field({ name: 'c', section: 'Physics' });

    expect(groupFields([a, b, c])).toEqual([
      { kind: 'section', section: 'Physics', fields: [a] },
      { kind: 'field', field: b },
      { kind: 'section', section: 'Physics', fields: [c] },
    ]);
  });

  it('returns an empty array when there are no fields', () => {
    expect(groupFields(undefined)).toEqual([]);
    expect(groupFields([])).toEqual([]);
  });
});
