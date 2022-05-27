import {
  TextureLoader,
  Texture,
  NearestFilter,
} from 'three';

import type { Renderable } from '../../components/renderable';
import type { Template } from '../../../engine/template';
import IOC from '../../../engine/ioc/ioc';
import { RESOURCES_LOADER_KEY_NAME } from '../../../engine/consts/global';

import { SpriteCropper } from './sprite-cropper';
import { RENDERABLE_COMPONENT_NAME } from './consts';

// TODO: Remove once resource loader will be moved to ts
interface ResourceLoader {
  load: (resource: string) => Promise<HTMLImageElement>;
}

const textureLoader = new TextureLoader();
const spriteCropper = new SpriteCropper();

export const loadTextures = async (renderable: Renderable): Promise<Array<Texture>> => {
  let textures: Array<Texture>;

  if (renderable.type === 'static') {
    textures = await textureLoader.loadAsync(renderable.src)
      .then((texture) => [texture]);
  } else {
    const resourceLoader = IOC.resolve(RESOURCES_LOADER_KEY_NAME) as ResourceLoader;

    textures = await resourceLoader.load(renderable.src)
      .then((spriteImage) => spriteCropper.crop(spriteImage, renderable));
  }

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
