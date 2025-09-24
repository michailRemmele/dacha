import { Texture, TextureSource, Rectangle } from 'pixi.js';

import { Sprite } from '../../../../components/sprite';

export const getTextureSource = (image: HTMLImageElement): TextureSource =>
  TextureSource.from({
    resource: image,
    scaleMode: 'nearest',
  });

export const getTextureArray = (
  textureSource: TextureSource,
  sprite: Sprite,
): Texture[] => {
  const textures: Texture[] = [];

  const frameWidth = Math.max(textureSource.width / sprite.slice, 1);
  const frameHeight = Math.max(textureSource.height, 1);

  for (let i = 0; i < sprite.slice; i += 1) {
    const rectangle = new Rectangle(i * frameWidth, 0, frameWidth, frameHeight);
    const texture = new Texture({ source: textureSource, frame: rectangle });

    textures.push(texture);
  }

  return textures;
};
