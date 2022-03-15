import { TextureLoader, Texture } from 'three';

import IOC from '../../../engine/ioc/ioc';
import { PREFAB_COLLECTION_KEY_NAME, RESOURCES_LOADER_KEY_NAME } from '../../../engine/consts/global';
import type { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import type { PrefabCollection, Prefab } from '../../../engine/prefab';
import type { GameObjectObserver } from '../../../engine/gameObject';
import type { Renderable } from '../../components/renderable';
import { ThreeJSRenderer } from '../../processors/three-js-renderer';

import { SpriteCropper } from './sprite-cropper';

const RENDERABLE_COMPONENT_NAME = 'renderable';
const TRANSFORM_COMPONENT_NAME = 'transform';
const LIGHT_COMPONENT_NAME = 'light';

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

const getImagesFromPrefabs = (images: Record<string, Renderable>, prefab: Prefab): void => {
  prefab.getChildren().forEach((childPrefab) => getImagesFromPrefabs(images, childPrefab));

  const renderable = prefab.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable | undefined;

  if (!renderable || images[renderable.src]) {
    return;
  }

  images[renderable.src] = renderable;
};

export class ThreeJSRendererPlugin implements ProcessorPlugin {
  private getImagesToLoad(gameObjectObserver: GameObjectObserver): Record<string, Renderable> {
    const prefabCollection = IOC.resolve(PREFAB_COLLECTION_KEY_NAME) as PrefabCollection;

    const imagesToLoad: Record<string, Renderable> = {};

    prefabCollection.getAll().forEach((prefab) => getImagesFromPrefabs(imagesToLoad, prefab));

    gameObjectObserver.getList().reduce(
      (acc: Record<string, Renderable>, gameObject) => {
        const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;

        if (!acc[renderable.src]) {
          acc[renderable.src] = renderable;
        }

        return acc;
      }, imagesToLoad,
    );

    return imagesToLoad;
  }

  async load(options: ThreeJSRendererPluginOptions): Promise<ThreeJSRenderer> {
    const {
      createGameObjectObserver,
      store,
      messageBus,
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

    const gameObjectObserver = createGameObjectObserver({
      components: [
        RENDERABLE_COMPONENT_NAME,
        TRANSFORM_COMPONENT_NAME,
      ],
    });

    const imagesToLoad = this.getImagesToLoad(gameObjectObserver);

    const textureMap: Record<string, Array<Texture>> = {};

    const spriteCropper = new SpriteCropper();

    await Promise.all(
      Object.keys(imagesToLoad).map((key) => {
        const renderable = imagesToLoad[key];

        if (renderable.type === 'static') {
          return textureLoader.loadAsync(renderable.src)
            .then((texture) => { textureMap[key] = [texture]; });
        }

        return resourceLoader.load(renderable.src)
          .then((spriteImage) => {
            textureMap[key] = spriteCropper.crop(spriteImage, renderable);
          });
      }),
    );

    return new ThreeJSRenderer({
      gameObjectObserver,
      lightsObserver: createGameObjectObserver({
        components: [
          LIGHT_COMPONENT_NAME,
          TRANSFORM_COMPONENT_NAME,
        ],
      }),
      store,
      messageBus,
      window,
      sortingLayers,
      backgroundColor,
      scaleSensitivity,
      textureMap,
    });
  }
}
