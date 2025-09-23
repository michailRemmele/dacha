import { BitmapText } from '../index';

describe('Contrib -> components -> BitmapText', () => {
  it('Returns correct values ', () => {
    const text = new BitmapText({
      text: 'Hello World',
      font: 'Arial',
      fontSize: 24,
      align: 'center',
      color: '#000',
      opacity: 1,
      blending: 'normal',
      disabled: false,
      sortingLayer: 'text',
      sortCenter: [0, 0],
    }).clone();

    expect(text.text).toEqual('Hello World');
    expect(text.font).toEqual('Arial');
    expect(text.fontSize).toEqual(24);
    expect(text.align).toEqual('center');
    expect(text.color).toEqual('#000');
    expect(text.opacity).toEqual(1);
    expect(text.blending).toEqual('normal');
    expect(text.disabled).toEqual(false);
    expect(text.sortingLayer).toEqual('text');
    expect(text.sortCenter).toEqual([0, 0]);
  });

  it('Correct updates values ', () => {
    const text = new BitmapText({
      text: 'Hello World',
      font: 'Arial',
      fontSize: 24,
      align: 'center',
      color: '#000',
      opacity: 1,
      blending: 'normal',
      disabled: false,
      sortingLayer: 'text',
      sortCenter: [0, 0],
    }).clone();

    text.fontSize = 48;
    text.color = '#444';
    text.align = 'right';

    expect(text.fontSize).toEqual(48);
    expect(text.color).toEqual('#444');
    expect(text.align).toEqual('right');
  });

  it('Clones return deep copy of original component', () => {
    const originalText = new BitmapText({
      text: 'Hello World',
      font: 'Arial',
      fontSize: 24,
      align: 'center',
      color: '#000',
      opacity: 1,
      blending: 'normal',
      disabled: false,
      sortingLayer: 'text',
      sortCenter: [0, 0],
    }).clone();
    const cloneText = originalText.clone();

    expect(originalText).not.toBe(cloneText);
  });
});
