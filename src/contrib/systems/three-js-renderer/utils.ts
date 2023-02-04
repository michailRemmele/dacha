import {
  Texture,
  NearestFilter,
  RepeatWrapping,
  ClampToEdgeWrapping,
} from 'three';

import type { Renderable } from '../../components/renderable';
import type { Template } from '../../../engine/template';
import type { ResourceLoader } from '../../../engine/resource-loader';
import IOC from '../../../engine/ioc/ioc';
import { RESOURCES_LOADER_KEY_NAME } from '../../../engine/consts/global';

import { SpriteCropper } from './sprite-cropper';
import { RENDERABLE_COMPONENT_NAME } from './consts';

const spriteCropper = new SpriteCropper();

export const loadImage = (renderable: Renderable): Promise<HTMLImageElement> => {
  const resourceLoader = IOC.resolve(RESOURCES_LOADER_KEY_NAME) as ResourceLoader;
  return resourceLoader.load(renderable.src) as Promise<HTMLImageElement>;
};

export const prepareSprite = (image: HTMLImageElement, renderable: Renderable): Array<Texture> => {
  const textures = renderable.type === 'static'
    ? [new Texture(image)]
    : spriteCropper.crop(image, renderable);

  textures.forEach((texture) => {
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.flipY = false;
  });

  return textures;
};

export const getImagesFromTemplates = (
  images: Record<string, Renderable>,
  template: Template,
): void => {
  template.getChildren().forEach((childTemplate) => getImagesFromTemplates(images, childTemplate));

  const renderable = template.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable | undefined;

  if (!renderable || images[renderable.src]) {
    return;
  }

  images[renderable.src] = renderable;
};

export const getTextureMapKey = ({
  slice,
  fit,
  width = 0,
  height = 0,
  src,
}: Renderable): string => `${slice}_${fit}_${width}_${height}_${src}`;

export const cloneTexture = (renderable: Renderable, texture: Texture): Texture => {
  const { fit, width = 0, height = 0 } = renderable;

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
