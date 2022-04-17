import { HexColorReader } from '../hex-color-reader';

describe('Contrib -> RenderSystem -> Color -> HexColorReader', () => {
  it('Converts hex colors to rgb numbers correctly', () => {
    const colorReader = new HexColorReader();

    expect(colorReader.read('#ffffff')).toEqual({
      red: 255,
      green: 255,
      blue: 255,
    });
    expect(colorReader.read('#000000')).toEqual({
      red: 0,
      green: 0,
      blue: 0,
    });
    expect(colorReader.read('#b61aff')).toEqual({
      red: 182,
      green: 26,
      blue: 255,
    });
    expect(colorReader.read('#79b168')).toEqual({
      red: 121,
      green: 177,
      blue: 104,
    });
  });
});
