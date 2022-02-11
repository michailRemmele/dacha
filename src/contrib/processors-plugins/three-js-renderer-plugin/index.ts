import { TextureLoader, Texture } from 'three';

import type { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import type { PrefabCollection } from '../../../engine/prefab';
import type { Renderable } from '../../components/renderable';
import IOC from '../../../engine/ioc/ioc';
import { ThreeJSRenderer } from '../../processors/three-js-renderer';
import { PREFAB_COLLECTION_KEY_NAME } from '../../../engine/consts/global';

const RENDERABLE_COMPONENT_NAME = 'renderable';
const TRANSFORM_COMPONENT_NAME = 'transform';

interface ThreeJSRendererPluginOptions extends ProcessorPluginOptions {
  windowNodeId: string
  sortingLayers: Array<string>
  backgroundColor: string
}

export class ThreeJSRendererPlugin implements ProcessorPlugin {
  async load(options: ThreeJSRendererPluginOptions): Promise<ThreeJSRenderer> {
    const {
      createGameObjectObserver,
      store,
      windowNodeId,
      sortingLayers,
      backgroundColor,
    } = options;

    const window = document.getElementById(windowNodeId);

    if (!window) {
      throw new Error('Unable to load RenderProcessor. Root canvas node not found');
    }

    const textureLoader = new TextureLoader();

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

    await Promise.all(
      Object.keys(imagesToLoad).map((key) => {
        const renderable = imagesToLoad[key];

        const frames = renderable.slice || 1;

        const promises: Array<Promise<Texture>> = [];
        for (let i = 0; i < frames; i += 1) {
          promises.push(textureLoader.loadAsync(`${renderable.src}/${i}.png`));
        }

        return Promise.all(promises)
          .then((textures) => { textureMap[key] = textures; })
          .catch(() => {});
      }),
    );

    return new ThreeJSRenderer({
      gameObjectObserver,
      store,
      window,
      sortingLayers,
      backgroundColor,
      textureMap,
    });
  }
}
