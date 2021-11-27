import { colorReaders } from './color-reader';

const HEX_COLOR_REGEXP = /#[0-9a-zA-Z]{6}/;
const SHORT_HEX_COLOR_REGEXP = /#[0-9a-zA-Z]{3}/;

const COLOR_RED_KEY = 'red';
const COLOR_GREEN_KEY = 'green';
const COLOR_BLUE_KEY = 'blue';

export class Color {
  private _color: Record<string, number> | undefined;

  constructor(color: string) {
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

    this._color = void 0;
    for (let i = 0; i < colorTypes.length; i += 1) {
      if (color.match(colorTypes[i].regexp)) {
        const Reader = colorTypes[i].reader;
        this._color = new Reader().read(color);
        break;
      }
    }

    if (!this._color) {
      throw new Error('Error while color initialization: unknown type of color presentation');
    }
  }

  red() {
    return (this._color as Record<string, number>)[COLOR_RED_KEY];
  }

  green() {
    return (this._color as Record<string, number>)[COLOR_GREEN_KEY];
  }

  blue() {
    return (this._color as Record<string, number>)[COLOR_BLUE_KEY];
  }
}
