import { TextureLoader, Texture } from 'three';

import type { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import type { PrefabCollection } from '../../../engine/prefab';
import type { Renderable } from '../../components/renderable';
import IOC from '../../../engine/ioc/ioc';
import { ThreeJSRenderer } from '../../processors/three-js-renderer';
import { PREFAB_COLLECTION_KEY_NAME, RESOURCES_LOADER_KEY_NAME } from '../../../engine/consts/global';

const RENDERABLE_COMPONENT_NAME = 'renderable';
const TRANSFORM_COMPONENT_NAME = 'transform';

// TODO: Remove once resource loader will be moved to ts
interface ResourceLoader {
  load: (resource: string) => Promise<HTMLImageElement>;
}

interface ThreeJSRendererPluginOptions extends ProcessorPluginOptions {
  windowNodeId: string
  sortingLayers: Array<string>
  backgroundColor: string
  scaleSensitivity: number
}

export class ThreeJSRendererPlugin implements ProcessorPlugin {
  async load(options: ThreeJSRendererPluginOptions): Promise<ThreeJSRenderer> {
    const {
      createGameObjectObserver,
      store,
      windowNodeId,
      sortingLayers,
      backgroundColor,
      scaleSensitivity,
    } = options;

    const window = document.getElementById(windowNodeId);

    if (!window) {
      throw new Error('Unable to load RenderProcessor. Root canvas node not found');
    }

    const textureLoader = new TextureLoader();
    const resourceLoader = IOC.resolve(RESOURCES_LOADER_KEY_NAME) as ResourceLoader;

    const prefabCollection = IOC.resolve(PREFAB_COLLECTION_KEY_NAME) as PrefabCollection;
    const gameObjectObserver = createGameObjectObserver({
      components: [
        RENDERABLE_COMPONENT_NAME,
        TRANSFORM_COMPONENT_NAME,
      ],
    });

    const imagesToLoad = prefabCollection.getAll().reduce(
      (acc: Record<string, Renderable>, prefab) => {
        const renderable = prefab.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable | undefined;

        if (!renderable || acc[renderable.src]) {
          return acc;
        }

        acc[renderable.src] = renderable;

        return acc;
      }, {},
    );
    gameObjectObserver.getList().reduce(
      (acc: Record<string, Renderable>, gameObject) => {
        const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;

        if (!acc[renderable.src]) {
          acc[renderable.src] = renderable;
        }

        return acc;
      }, imagesToLoad,
    );

    const textureMap: Record<string, Array<Texture>> = {};

    const spriteCropper = document.createElement('canvas');
    const spriteCropperCtx = spriteCropper.getContext('2d');

    if (!spriteCropperCtx) {
      throw new Error('Can\'t create canvas context for sprite cropper');
    }

    await Promise.all(
      Object.keys(imagesToLoad).map((key) => {
        const renderable = imagesToLoad[key];

        if (renderable.type === 'static') {
          return textureLoader.loadAsync(renderable.src)
            .then((texture) => { textureMap[key] = [texture]; });
        }

        return resourceLoader.load(renderable.src)
          .then((spriteImage) => {
            const frames = renderable.slice as number;
            const frameWidth = spriteImage.width / frames;
            const frameHeight = spriteImage.height;

            spriteCropper.width = frameWidth;
            spriteCropper.height = frameHeight;

            textureMap[key] = new Array<Texture>(frames);

            for (let i = 0; i < frames; i += 1) {
              spriteCropperCtx.clearRect(0, 0, frameWidth, frameHeight);

              spriteCropperCtx.drawImage(
                spriteImage,
                frameWidth * i, 0,
                frameWidth, frameHeight,
                0, 0,
                frameWidth, frameHeight,
              );

              const frameImageData = spriteCropperCtx.getImageData(0, 0, frameWidth, frameHeight);

              // Some issue with three.js d.ts probably,
              // cause it should take ImageData as first argument
              const texture = new Texture(frameImageData as unknown as HTMLImageElement);
              texture.needsUpdate = true;

              textureMap[key][i] = texture;
            }
          });
      }),
    );

    return new ThreeJSRenderer({
      gameObjectObserver,
      store,
      window,
      sortingLayers,
      backgroundColor,
      scaleSensitivity,
      textureMap,
    });
  }
}
