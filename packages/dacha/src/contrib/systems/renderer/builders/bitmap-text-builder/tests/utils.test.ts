import type { BitmapFont } from 'pixi.js';

import { filterUnsupportedChars } from '../utils';

const font = { chars: { a: {}, b: {}, ' ': {} } } as unknown as Pick<
  BitmapFont,
  'chars'
>;

describe('filterUnsupportedChars', () => {
  it('removes characters without glyphs and keeps line breaks and tabs', () => {
    expect(filterUnsupportedChars('axb\ny\r\t', font)).toBe('ab\n\r\t');
  });
});
