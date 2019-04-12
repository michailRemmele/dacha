import ColorReader from './colorReader';

const HEX_RADIX = 16;
const REPEAT_COUNT = 2;
const SHARP = '#';
const COLOR_RED_KEY = 'red';
const COLOR_GREEN_KEY = 'green';
const COLOR_BLUE_KEY = 'blue';
const COLOR_PARTS = [
  COLOR_RED_KEY,
  COLOR_GREEN_KEY,
  COLOR_BLUE_KEY,
];

class ShortHexColorReader extends ColorReader {
  read(color) {
    color = color.replace(SHARP, '');

    return COLOR_PARTS.reduce((colorInfo, colorPartName, index) => {
      colorInfo[colorPartName] = parseInt(color[index].repeat(REPEAT_COUNT), HEX_RADIX);
      return colorInfo;
    }, {});
  }
}

export default ShortHexColorReader;
