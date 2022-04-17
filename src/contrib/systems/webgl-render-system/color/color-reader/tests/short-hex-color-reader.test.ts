import { ShortHexColorReader } from '../short-hex-color-reader';

describe('Contrib -> RenderSystem -> Color -> ShortHexColorReader', () => {
  it('Converts short hex colors to rgb numbers correctly', () => {
    const colorReader = new ShortHexColorReader();

    expect(colorReader.read('#fff')).toEqual({
      red: 255,
      green: 255,
      blue: 255,
    });
    expect(colorReader.read('#000')).toEqual({
      red: 0,
      green: 0,
      blue: 0,
    });
    expect(colorReader.read('#7b2')).toEqual({
      red: 119,
      green: 187,
      blue: 34,
    });
    expect(colorReader.read('#a39')).toEqual({
      red: 170,
      green: 51,
      blue: 153,
    });
  });
});
