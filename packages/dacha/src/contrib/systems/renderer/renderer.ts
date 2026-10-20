import {
  Application,
  Container,
  type ViewContainer,
  Color,
  RenderLayer,
} from 'pixi.js';

import { WorldSystem, type WorldSystemOptions } from '../../../engine/system';
import { DefineSystem } from '../../../engine/decorators';
import type { Time } from '../../../engine/time';
import { type Scene } from '../../../engine/scene';
import { Transform } from '../../components/transform';
import { Camera } from '../../components/camera';
import { CameraAPI } from '../camera-system';
import { getWindowNode } from '../../utils/get-window-node';

import { RendererAPI } from './api';
import {
  composeSort,
  SortFn,
  createSortByLayer,
  sortByYAxis,
  sortByXAxis,
} from './sort';
import { parseSortingLayers } from './sort/utils';
import type { Sorting, RendererDependencies } from './types';
import type { Assets } from '../../../engine/asset';
import { ActorRenderTree } from './actor-render-tree';
import { FilterSystem } from './filters';
import { MaterialSystem } from './material';
import type { FilterEffectConfig } from './filters/filter-effect';
import { SORTING_ORDER_MAPPING } from './consts';

interface RendererOptions extends WorldSystemOptions {
  windowNodeId: string;
  backgroundColor: string;
  filterEffects?: FilterEffectConfig[];
}

/**
 * Draws the actors that have a view component: {@link Sprite}, {@link Shape},
 * {@link BitmapText}, {@link Mesh} or {@link PixiView}.
 *
 * The system registers {@link RendererAPI} in `world.systemApi`.
 *
 * Options:
 *
 * - `windowNodeId`: the id of the element the renderer adds its canvas to.
 * - `backgroundColor`: the window background color.
 * - `filterEffects`: post-processing effects for the whole screen.
 *
 * The global option `sorting` sets the sorting layers and the draw order, see
 * {@link Sorting}. Pass your shaders and filter effects with
 * `Renderer.with({ shaders, filterEffects })`, see {@link RendererDependencies}.
 *
 * The renderer needs {@link CameraSystem} before it in the systems list. Put it after
 * every system that moves actors or changes their view components.
 *
 * @see [Rendering](https://dachajs.org/systems/rendering/)
 *
 * @category Rendering
 */
@DefineSystem({
  name: 'Renderer',
  icon: 'Filmstrip',
  fields: [
    {
      name: 'windowNodeId',
      type: 'string',
      initialValue: 'root',
    },
    {
      name: 'backgroundColor',
      type: 'color',
      initialValue: '#000',
    },
    {
      name: 'filterEffects',
      type: 'script',
      kind: 'filterEffect',
      multiple: true,
      sortable: true,
    },
  ],
})
export class Renderer extends WorldSystem {
  private window: HTMLElement;
  private application: Application;
  private worldContainer: Container;
  private sortingLayers: Map<string, RenderLayer>;
  private sortFn: SortFn;
  private backgroundColor: Color;
  private cameraApi: CameraAPI;
  private assets: Assets;
  private actorRenderTree?: ActorRenderTree;
  private filterSystem: FilterSystem;
  private materialSystem: MaterialSystem;
  private time: Time;
  private rendererApi: RendererAPI;
  private resizeObserver?: ResizeObserver;

  constructor(options: RendererOptions, dependencies?: RendererDependencies) {
    super();

    const {
      globalOptions,
      windowNodeId,
      backgroundColor,
      assets,
      world,
      filterEffects,
      time,
    } = options;

    this.time = time;

    this.backgroundColor = new Color(backgroundColor);

    this.window = getWindowNode(windowNodeId);

    const sorting = globalOptions.sorting as Sorting | undefined;
    const sortingOrder = SORTING_ORDER_MAPPING[sorting?.order ?? 'bottomRight'];

    const parsedSortingLayers = parseSortingLayers(sorting?.layers);

    this.sortFn = composeSort([
      createSortByLayer(parsedSortingLayers),
      sortByYAxis(sortingOrder[1]),
      sortByXAxis(sortingOrder[0]),
    ]);

    this.sortingLayers = new Map();
    parsedSortingLayers.forEach((name) =>
      this.sortingLayers.set(
        name,
        new RenderLayer({
          sortableChildren: true,
          sortFunction: this.sortFn as (a: Container, b: Container) => number,
        }),
      ),
    );

    this.application = new Application();
    this.worldContainer = new Container();

    this.assets = assets;

    this.materialSystem = new MaterialSystem({
      shaders: dependencies?.shaders,
      time: this.time,
      assets: this.assets,
    });
    this.filterSystem = new FilterSystem({
      application: this.application,
      time: this.time,
      assets: this.assets,
      filterEffects,
      availableFilterEffects: dependencies?.filterEffects,
    });

    this.cameraApi = world.systemApi.get(CameraAPI);

    this.rendererApi = new RendererAPI({
      application: this.application,
      worldContainer: this.worldContainer,
      getViewEntries: (): Set<ViewContainer> | undefined =>
        this.actorRenderTree?.viewEntries,
      sortFn: this.sortFn,
      filterSystem: this.filterSystem,
      materialSystem: this.materialSystem,
    });

    world.systemApi.register(this.rendererApi);
  }

  async onWorldLoad(): Promise<void> {
    await this.application.init({
      autoStart: false,
      width: this.window.clientWidth,
      height: this.window.clientHeight,
      backgroundColor: this.backgroundColor.toHex(),
      backgroundAlpha: this.backgroundColor.alpha,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });

    this.window.appendChild(this.application.canvas);

    this.resizeObserver = new ResizeObserver(() => {
      this.application.renderer.resize(
        this.window.clientWidth,
        this.window.clientHeight,
      );
      this.updateCamera();
      this.application.renderer.render({ container: this.application.stage });
    });
    this.resizeObserver.observe(this.window);

    this.application.stage.addChild(this.worldContainer);

    this.sortingLayers.forEach((layer) =>
      this.application.stage.addChild(layer),
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.__PIXI_DEVTOOLS__ = {
      app: this.application,
    };
  }

  onWorldDestroy(): void {
    this.filterSystem.clear();

    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;

    this.window.removeChild(this.application.canvas);
    this.application.destroy();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.__PIXI_DEVTOOLS__ = undefined;
  }

  onSceneEnter(scene: Scene): void {
    this.actorRenderTree = new ActorRenderTree({
      scene,
      worldContainer: this.worldContainer,
      assets: this.assets,
      sortingLayers: this.sortingLayers,
      materialSystem: this.materialSystem,
    });
  }

  onSceneExit(): void {
    this.actorRenderTree?.destroy();
    this.actorRenderTree = undefined;

    this.application.renderer.clear();
  }

  private updateCamera(): void {
    const currentCamera = this.cameraApi.getCurrentCamera();
    const transform = currentCamera?.getComponent(Transform);
    const camera = currentCamera?.getComponent(Camera);

    const x = transform?.world.position.x ?? 0;
    const y = transform?.world.position.y ?? 0;
    const zoom = camera?.zoom ?? 1;

    this.worldContainer.scale.set(zoom);
    this.worldContainer.position.set(
      this.application.renderer.width / 2,
      this.application.renderer.height / 2,
    );
    this.worldContainer.pivot.set(x, y);
  }

  update(): void {
    this.updateCamera();

    this.actorRenderTree?.update();

    this.filterSystem.update();

    this.application.renderer.render({ container: this.application.stage });
  }
}
