import type { BitmapFont } from 'pixi.js';

const SPECIAL_SYMBOLS = new Set(['\n', '\r', '\t']);

export const filterUnsupportedChars = (
  text: string,
  font: BitmapFont,
): string => {
  return text
    .split('')
    .filter((char) => font.chars[char] || SPECIAL_SYMBOLS.has(char))
    .join('');
};
