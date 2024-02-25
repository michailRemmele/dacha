import {
  Texture,
  NearestFilter,
  RepeatWrapping,
  ClampToEdgeWrapping,
} from 'three/src/Three';

import { Sprite } from '../../components/sprite';
import type { Template } from '../../../engine/template';
import { ResourceLoader } from '../../../engine/resource-loader';

import { SpriteCropper } from './sprite-cropper';

const spriteCropper = new SpriteCropper();
const resourceLoader = new ResourceLoader();

export const loadImage = (
  sprite: Sprite,
): Promise<HTMLImageElement> => resourceLoader.load(sprite.src) as Promise<HTMLImageElement>;

export const prepareSprite = (image: HTMLImageElement, sprite: Sprite): Array<Texture> => {
  const textures = spriteCropper.crop(image, sprite);

  textures.forEach((texture) => {
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.flipY = false;
  });

  return textures;
};

export const getImagesFromTemplates = (
  images: Record<string, Sprite>,
  template: Template,
): void => {
  template.children.forEach((childTemplate) => getImagesFromTemplates(images, childTemplate));

  const sprite = template.getComponent(Sprite);

  if (!sprite || images[sprite.src]) {
    return;
  }

  images[sprite.src] = sprite;
};

export const getTextureMapKey = ({
  slice,
  fit,
  width = 0,
  height = 0,
  src,
}: Sprite): string => `${slice}_${fit}_${width}_${height}_${src}`;

export const cloneTexture = (sprite: Sprite, texture: Texture): Texture => {
  const { fit, width = 0, height = 0 } = sprite;

  const repeatX = fit === 'repeat' ? width / (texture.image as HTMLImageElement).width : 1;
  const repeatY = fit === 'repeat' ? height / (texture.image as HTMLImageElement).height : 1;

  const newTexture = texture.clone();
  if (fit === 'repeat') {
    newTexture.wrapS = RepeatWrapping;
    newTexture.wrapT = RepeatWrapping;
  } else {
    newTexture.wrapS = ClampToEdgeWrapping;
    newTexture.wrapT = ClampToEdgeWrapping;
  }
  newTexture.repeat.set(repeatX, repeatY);
  newTexture.needsUpdate = true;
  return newTexture;
};
