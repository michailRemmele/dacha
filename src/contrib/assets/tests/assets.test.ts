import { Texture, Audio, BitmapFont } from '..';

describe('Contrib -> assets', () => {
  it('reads src from data', () => {
    const texture = new Texture({
      id: 'a1',
      name: 'Hero',
      data: { src: 'img/hero.png' },
    });
    const audio = new Audio({
      id: 'a2',
      name: 'Jump',
      data: { src: 'sfx/jump.wav' },
    });
    const font = new BitmapFont({
      id: 'a3',
      name: 'Main',
      data: { src: 'fonts/main.fnt' },
    });

    expect(texture.src).toBe('img/hero.png');
    expect(audio.src).toBe('sfx/jump.wav');
    expect(font.src).toBe('fonts/main.fnt');
  });

  it('defaults src to an empty string', () => {
    expect(new Texture({ id: 'a1', name: 'Hero', data: {} }).src).toBe('');
    expect(new Audio({ id: 'a2', name: 'Jump', data: {} }).src).toBe('');
    expect(new BitmapFont({ id: 'a3', name: 'Main', data: {} }).src).toBe('');
  });

  it('exposes id and name inherited from Asset', () => {
    const texture = new Texture({ id: 'a1', name: 'Hero', data: {} });

    expect(texture.id).toBe('a1');
    expect(texture.name).toBe('Hero');
  });

  it('declares kind names matching the editor schemas', () => {
    expect(Texture.assetName).toBe('texture');
    expect(Audio.assetName).toBe('audio');
    expect(BitmapFont.assetName).toBe('bitmapFont');
  });
});
