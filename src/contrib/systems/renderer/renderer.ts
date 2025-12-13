import {
  Application,
  Container,
  type ViewContainer,
  Color,
  RenderLayer,
  type IRenderLayer,
} from 'pixi.js';

import { WorldSystem, type WorldSystemOptions } from '../../../engine/system';
import { type Scene } from '../../../engine/scene';
import { Transform } from '../../components/transform';
import { Camera } from '../../components/camera';
import { CameraService } from '../camera-system';
import { getWindowNode } from '../../utils/get-window-node';

import { RendererService } from './service';
import {
  composeSort,
  SortFn,
  createSortByLayer,
  sortByYAxis,
  sortByXAxis,
} from './sort';
import { parseSortingLayers } from './sort/utils';
import type { Sorting } from './types';
import { Assets } from './assets';
import { ActorRenderTree } from './actor-render-tree';
import { SORTING_ORDER_MAPPING } from './consts';

interface RendererOptions extends WorldSystemOptions {
  windowNodeId: string;
  backgroundColor: string;
}

/**
 * Renderer system that manages 2D graphics rendering using PIXI.js under the hood
 *
 * @extends WorldSystem
 *
 * @category Systems
 */
export class Renderer extends WorldSystem {
  private window: HTMLElement;
  private application: Application;
  private worldContainer: Container;
  private sortingLayers: Map<string, IRenderLayer>;
  private sortFn: SortFn;
  private backgroundColor: Color;
  private cameraService: CameraService;
  private assets: Assets;
  private actorRenderTree?: ActorRenderTree;

  constructor(options: WorldSystemOptions) {
    super();

    const {
      globalOptions,
      windowNodeId,
      backgroundColor,
      templateCollection,
      world,
    } = options as RendererOptions;

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

    this.assets = new Assets({ templateCollection });

    this.cameraService = world.getService(CameraService);

    world.addService(
      new RendererService({
        application: this.application,
        worldContainer: this.worldContainer,
        getViewEntries: (): Set<ViewContainer> | undefined =>
          this.actorRenderTree?.viewEntries,
        sortFn: this.sortFn,
      }),
    );
  }

  async onWorldLoad(): Promise<void> {
    await this.application.init({
      autoStart: false,
      resizeTo: this.window,
      width: this.window.clientWidth,
      height: this.window.clientHeight,
      backgroundColor: this.backgroundColor.toHex(),
      backgroundAlpha: this.backgroundColor.alpha,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });

    this.window.appendChild(this.application.canvas);
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
    this.window.removeChild(this.application.canvas);
    this.application.destroy();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.__PIXI_DEVTOOLS__ = undefined;
  }

  async onSceneLoad(scene: Scene): Promise<void> {
    await this.assets.load(scene);
  }

  onSceneEnter(scene: Scene): void {
    this.actorRenderTree = new ActorRenderTree({
      scene,
      worldContainer: this.worldContainer,
      assets: this.assets,
      sortingLayers: this.sortingLayers,
    });
  }

  onSceneExit(): void {
    this.actorRenderTree?.destroy();
    this.actorRenderTree = undefined;

    this.application.renderer.clear();
  }

  onSceneDestroy(scene: Scene): void {
    this.assets.unload(scene);
  }

  private updateCamera(): void {
    const currentCamera = this.cameraService.getCurrentCamera();
    const transform = currentCamera?.getComponent(Transform);
    const camera = currentCamera?.getComponent(Camera);

    const offsetX = transform?.offsetX ?? 0;
    const offsetY = transform?.offsetY ?? 0;
    const zoom = camera?.zoom ?? 1;

    this.worldContainer.scale.set(zoom);
    this.worldContainer.position.set(
      this.application.renderer.width / 2,
      this.application.renderer.height / 2,
    );
    this.worldContainer.pivot.set(offsetX, offsetY);
  }

  update(): void {
    this.updateCamera();

    this.actorRenderTree?.update();

    this.application.renderer.render({ container: this.application.stage });
  }
}

Renderer.systemName = 'Renderer';
