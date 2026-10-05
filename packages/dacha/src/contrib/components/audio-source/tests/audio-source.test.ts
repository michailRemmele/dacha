import { AudioSource } from '../index';
import type { AudioSourceConfig } from '../index';

describe('Contrib -> components -> AudioSource', () => {
  it('Returns correct values', () => {
    const source = new AudioSource({
      src: 'shot.mp3',
      group: 'effects',
      looped: true,
      volume: 0.5,
      autoplay: true,
    });

    expect(source.src).toEqual('shot.mp3');
    expect(source.group).toEqual('effects');
    expect(source.looped).toEqual(true);
    expect(source.volume).toEqual(0.5);
    expect(source.autoplay).toEqual(true);
  });

  it('Uses initial values for missing keys', () => {
    const source = new AudioSource({} as AudioSourceConfig);

    expect(source.src).toEqual('');
    expect(source.group).toEqual('master');
    expect(source.looped).toEqual(false);
    expect(source.volume).toEqual(1);
    expect(source.autoplay).toEqual(false);
  });
});
