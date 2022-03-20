import { filterByKey } from '../filter-by-key';

describe('Engine -> utils -> filterByKey()', () => {
  it('Returns object without field which should be deleted', () => {
    const data = {
      key1: 12,
      key2: 'someValue',
      key3: true,
    };

    expect(filterByKey(data, 'key2')).toStrictEqual({
      key1: 12,
      key3: true,
    });
  });

  it('Returns object without any changes if object doesn\'t contain specified field', () => {
    const data = {
      key1: 12,
      key2: 'someValue',
      key3: true,
    };

    expect(filterByKey(data, 'key4')).toStrictEqual({
      key1: 12,
      key2: 'someValue',
      key3: true,
    });
  });
});
