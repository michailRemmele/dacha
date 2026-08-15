import { toKebabCase } from '../to-kebab-case';

describe('Utils -> toKebabCase()', () => {
  it('Returns formatted name', () => {
    expect(toKebabCase('example')).toBe('example');
    expect(toKebabCase('ExampleName')).toBe('example-name');
    expect(toKebabCase('example name')).toBe('example-name');
    expect(toKebabCase('--example---name-')).toBe('example-name');
    expect(toKebabCase('  Example123 ')).toBe('example123');
  });
});
