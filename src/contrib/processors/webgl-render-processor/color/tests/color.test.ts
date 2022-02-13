import { Color } from '../index';

describe('Contrib -> RenderProcessor -> Color', () => {
  it('Selects reader and returns rgb parts correctly', () => {
    const fullWhite = new Color('#ffffff');

    expect(fullWhite.red()).toEqual(255);
    expect(fullWhite.green()).toEqual(255);
    expect(fullWhite.blue()).toEqual(255);

    const fullRed = new Color('#e44d1b');

    expect(fullRed.red()).toEqual(228);
    expect(fullRed.green()).toEqual(77);
    expect(fullRed.blue()).toEqual(27);

    const shortBlack = new Color('#000');

    expect(shortBlack.red()).toEqual(0);
    expect(shortBlack.green()).toEqual(0);
    expect(shortBlack.blue()).toEqual(0);

    const shortBlue = new Color('#3ac');

    expect(shortBlue.red()).toEqual(51);
    expect(shortBlue.green()).toEqual(170);
    expect(shortBlue.blue()).toEqual(204);
  });
});
