import { ColorReader } from './color-reader';
import {
  HEX_RADIX,
  SHARP,
  COLORS,
} from './consts';

const BYTE_SHIFT = 8;
const MAX_COLOR_NUMBER = 255;

export class HexColorReader implements ColorReader {
  read(color: string) {
    const value = parseInt(color.replace(SHARP, ''), HEX_RADIX);

    return COLORS.reduce((colorInfo: Record<string, number>, name, index, array) => {
      // More optimized way to read color
      // eslint-disable-next-line no-bitwise
      colorInfo[name] = (value >> (BYTE_SHIFT * (array.length - index - 1))) & MAX_COLOR_NUMBER;
      return colorInfo;
    }, {});
  }
}
