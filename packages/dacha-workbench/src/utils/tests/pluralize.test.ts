import { pluralize } from '../pluralize';

describe('Utils -> pluralize()', () => {
  it('Returns plural form', () => {
    expect(pluralize('system')).toBe('systems');
    expect(pluralize('component')).toBe('components');
    expect(pluralize('behavior')).toBe('behaviors');

    expect(pluralize('child')).toBe('children');
    expect(pluralize('bus')).toBe('buses');
  });
});
