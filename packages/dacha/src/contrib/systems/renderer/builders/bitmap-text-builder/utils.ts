import type { BitmapFont } from 'pixi.js';

const SPECIAL_SYMBOLS = new Set(['\n', '\r', '\t']);

/**
 * Removes the characters the font has no glyphs for.
 *
 * @internal
 */
export const filterUnsupportedChars = (
  text: string,
  font: Pick<BitmapFont, 'chars'>,
): string => {
  return text
    .split('')
    .filter((char) => font.chars[char] || SPECIAL_SYMBOLS.has(char))
    .join('');
};
