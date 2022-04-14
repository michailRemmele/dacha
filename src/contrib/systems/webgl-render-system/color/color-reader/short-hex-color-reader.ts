import { ColorReader } from './color-reader';
import {
  HEX_RADIX,
  SHARP,
  COLORS,
} from './consts';

const REPEAT_COUNT = 2;

export class ShortHexColorReader implements ColorReader {
  read(color: string) {
    const value = color.replace(SHARP, '');

    return COLORS.reduce((colorInfo: Record<string, number>, name, index) => {
      colorInfo[name] = parseInt(value[index].repeat(REPEAT_COUNT), HEX_RADIX);
      return colorInfo;
    }, {});
  }
}
