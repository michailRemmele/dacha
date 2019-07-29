import ColorReader from './colorReader';

const BYTE_SHIFT = 8;
const HEX_RADIX = 16;
const MAX_COLOR_NUMBER = 255;
const SHARP = '#';
const COLOR_RED_KEY = 'red';
const COLOR_GREEN_KEY = 'green';
const COLOR_BLUE_KEY = 'blue';
const COLORS = [
  COLOR_RED_KEY,
  COLOR_GREEN_KEY,
  COLOR_BLUE_KEY,
];

class ShortHexColorReader extends ColorReader {
  read(color) {
    const value = parseInt(color.replace(SHARP, ''), HEX_RADIX);

    return COLORS.reduce((colorInfo, name, index, array) => {
      colorInfo[name] = (value >> (BYTE_SHIFT * (array.length - index - 1))) & MAX_COLOR_NUMBER;
      return colorInfo;
    }, {});
  }
}

export default ShortHexColorReader;
