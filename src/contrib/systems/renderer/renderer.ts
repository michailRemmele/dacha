import { Application, Container } from 'pixi.js';

import { AddActor, RemoveActor } from '../../../engine/events';
import type { AddActorEvent, RemoveActorEvent } from '../../../engine/events';
import { WorldSystem } from '../../../engine/system';
import type { WorldSystemOptions } from '../../../engine/system';
import { ActorCollection } from '../../../engine/actor';
import type { TemplateCollection } from '../../../engine/template';
import type { Scene } from '../../../engine/scene';
import { Transform } from '../../components/transform';
import { Sprite } from '../../components/sprite';
import { Camera } from '../../components/camera';
import { CameraService } from '../camera-system';
import { CacheStore } from '../../../engine/data-lib';
import { getWindowNode } from '../../utils/get-window-node';

// import { RendererService } from './service';
import {
  composeSort,
  SortFn,
  createSortByLayer,
  sortByYAxis,
  sortByXAxis,
  sortByZAxis,
} from './sort';
import { parseSortingLayers } from './sort/utils';
// import { LightSubsystem } from './light-subsystem';
import { loadImage, getAllSources } from './utils';
import type { SortingLayers } from './types';
import { SpriteBuilder } from './builders';
import type { Builder } from './builders';

interface RendererOptions extends WorldSystemOptions {
  windowNodeId: string;
  backgroundColor: string;
  backgroundAlpha: number;
}

export class Renderer extends WorldSystem {
  private actorCollection?: ActorCollection;
  private window: HTMLElement;
  private application: Application;
  private worldContainer: Container;
  private imageStore: CacheStore<HTMLImageElement>;
  private builders: Record<string, Builder>;
  private sortFn: SortFn;
  // private lightSubsystem: LightSubsystem;
  private templateCollection: TemplateCollection;
  private backgroundColor: string;
  private backgroundAlpha: number;
  private cameraService: CameraService;

  constructor(options: WorldSystemOptions) {
    super();

    const {
      globalOptions,
      windowNodeId,
      backgroundColor,
      backgroundAlpha,
      templateCollection,
      world,
    } = options as RendererOptions;

    this.templateCollection = templateCollection;
    this.backgroundColor = backgroundColor;
    this.backgroundAlpha = backgroundAlpha;

    this.window = getWindowNode(windowNodeId);

    this.sortFn = composeSort([
      createSortByLayer(
        parseSortingLayers(
          (globalOptions.sortingLayers as SortingLayers)?.layers,
        ),
      ),
      sortByYAxis,
      sortByXAxis,
      sortByZAxis,
    ]);

    this.application = new Application();
    this.worldContainer = new Container({ sortableChildren: true });

    // this.lightSubsystem = new LightSubsystem(this.renderScene);

    this.imageStore = new CacheStore<HTMLImageElement>();

    this.builders = {
      [Sprite.componentName]: new SpriteBuilder({
        imageStore: this.imageStore,
      }),
    };

    this.cameraService = world.getService(CameraService);

    // world.addService(new RendererService({
    //   threeScene: this.renderScene,
    //   threeCamera: this.currentCamera,
    //   window: this.window,
    //   sortFn: this.sortFn,
    //   cameraService: this.cameraService,
    // }));
  }

  async onWorldLoad(): Promise<void> {
    await this.application.init({
      autoStart: false,
      resizeTo: window,
      width: this.window.clientWidth,
      height: this.window.clientHeight,
      backgroundColor: this.backgroundColor,
      backgroundAlpha: this.backgroundAlpha,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });

    this.window.appendChild(this.application.canvas);
    this.application.stage.addChild(this.worldContainer);

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
    const allSources = [
      ...getAllSources(this.templateCollection.getAll()),
      ...getAllSources(scene.children),
    ];
    const uniqueSources = [...new Set(allSources)];

    const images = await Promise.all(
      uniqueSources.map((src) => {
        return !this.imageStore.has(src) ? this.loadImage(src) : undefined;
      }),
    );

    uniqueSources.forEach((src, index) => {
      if (images[index]) {
        this.imageStore.add(src, images[index]!);
      }
    });
    allSources.forEach((src) => this.imageStore.retain(src));
  }

  onSceneEnter(scene: Scene): void {
    this.actorCollection = new ActorCollection(scene, {
      components: [Sprite, Transform],
    });

    // this.lightSubsystem.onSceneEnter(scene);

    this.actorCollection.addEventListener(AddActor, this.handleActorAdd);
    this.actorCollection.addEventListener(RemoveActor, this.handleActorRemove);
  }

  onSceneExit(): void {
    this.actorCollection?.removeEventListener(AddActor, this.handleActorAdd);
    this.actorCollection?.removeEventListener(
      RemoveActor,
      this.handleActorRemove,
    );

    this.worldContainer.removeChildren();
    this.application.renderer.clear();

    this.actorCollection?.forEach((actor) => {
      this.builders[Sprite.componentName].destroy(actor);
    });

    // this.lightSubsystem.onSceneExit();

    this.actorCollection = undefined;
  }

  onSceneDestroy(scene: Scene): void {
    const allSources = [
      ...getAllSources(this.templateCollection.getAll()),
      ...getAllSources(scene.children),
    ];

    allSources.forEach((src) => this.imageStore.release(src));
    this.imageStore.cleanReleased();
  }

  private handleActorAdd = (event: AddActorEvent): void => {
    const { actor } = event;

    const { src } = actor.getComponent(Sprite);

    if (this.imageStore.has(src)) {
      this.imageStore.retain(src);
    } else {
      void this.loadImage(src).then((image) => {
        if (image) {
          this.imageStore.add(src, image);
          this.imageStore.retain(src);
        }
      });
    }
  };

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;

    const sprite = actor.getComponent(Sprite);
    this.imageStore.release(sprite.src);

    if (sprite.renderData?.sprite) {
      this.worldContainer.removeChild(sprite.renderData.sprite);
      this.builders[Sprite.componentName].destroy(actor);
    }
  };

  private async loadImage(src: string): Promise<HTMLImageElement | undefined> {
    if (!src) {
      return undefined;
    }

    try {
      const image = await loadImage(src);
      return image;
    } catch (error: unknown) {
      console.warn(`Can't load image by the following url: ${src}`, error);
      return undefined;
    }
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

  private updateActors(): void {
    this.actorCollection?.forEach((actor, index) => {
      const builder = this.builders[Sprite.componentName];

      if (!builder.hasView(actor)) {
        this.worldContainer.addChild(builder.buildView(actor));
      }

      builder.updateView(actor, index);
    });
  }

  update(): void {
    this.updateCamera();

    // this.lightSubsystem.update();

    this.actorCollection?.sort(this.sortFn);
    this.updateActors();

    this.application.renderer.render({ container: this.application.stage });
  }
}

Renderer.systemName = 'Renderer';
