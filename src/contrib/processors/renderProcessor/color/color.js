import colorReaders from './colorReader';

const HEX_COLOR_REGEXP = /#[0-9a-zA-Z]{6}/;
const SHORT_HEX_COLOR_REGEXP = /#[0-9a-zA-Z]{3}/;

const COLOR_RED_KEY = 'red';
const COLOR_GREEN_KEY = 'green';
const COLOR_BLUE_KEY = 'blue';

class Color {
  constructor(color) {
    const colorTypes = [
      {
        regexp: HEX_COLOR_REGEXP,
        reader: colorReaders.hexColorReader,
      },
      {
        regexp: SHORT_HEX_COLOR_REGEXP,
        reader: colorReaders.shortHeColorReader,
      },
    ];

    this._color = undefined;
    colorTypes.some((colorType) => {
      if (color.match(colorType.regexp)) {
        const Reader = colorType.reader;
        this._color = new Reader().read(color);
        return true;
      }
    });

    if (!this._color) {
      throw new Error('Error while color initialization: unknown type of color presentation');
    }
  }

  red() {
    return this._color[COLOR_RED_KEY];
  }

  green() {
    return this._color[COLOR_GREEN_KEY];
  }

  blue() {
    return this._color[COLOR_BLUE_KEY];
  }
}

export default Color;
