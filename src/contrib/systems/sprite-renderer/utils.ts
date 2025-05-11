import {
  Texture,
  NearestFilter,
  RepeatWrapping,
  ClampToEdgeWrapping,
} from 'three/src/Three';

import { Sprite } from '../../components/sprite';
import type { TemplateCollection } from '../../../engine/template';
import { ResourceLoader } from '../../../engine/resource-loader';
import { traverseEntity } from '../../../engine/entity';

import { SpriteCropper } from './sprite-cropper';

const spriteCropper = new SpriteCropper();
const resourceLoader = new ResourceLoader();

export const loadImage = (
  spriteSourcePath: string,
): Promise<HTMLImageElement> => resourceLoader.load(spriteSourcePath) as Promise<HTMLImageElement>;

export const prepareSprite = (image: HTMLImageElement, sprite: Sprite): Texture[] => {
  const textures = spriteCropper.crop(image, sprite);

  textures.forEach((texture) => {
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.flipY = false;
  });

  return textures;
};

export const getAllTemplateSources = (templateCollection: TemplateCollection): string[] => {
  const templateSources: string[] = [];

  templateCollection.getAll().forEach((template) => {
    traverseEntity(template, (entity) => {
      const audioSource = entity.getComponent(Sprite);
      if (audioSource?.src) {
        templateSources.push(audioSource.src);
      }
    });
  });

  return templateSources;
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
