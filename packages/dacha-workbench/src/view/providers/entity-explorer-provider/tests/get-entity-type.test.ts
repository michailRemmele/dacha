import { getEntityType } from '../get-entity-type';

describe('getEntityType asset', () => {
  it('returns asset for the assets section', () => {
    expect(getEntityType(['assets', 'id:a1'])).toBe('asset');
  });

  it('still returns actor / template / scene', () => {
    expect(getEntityType(['scenes', 'id:s', 'actors', 'id:a'])).toBe('actor');
    expect(getEntityType(['templates', 'id:t'])).toBe('template');
    expect(getEntityType(['scenes', 'id:s'])).toBe('scene');
  });
});
