import {
  Application,
  Container,
  type ViewContainer,
  Color,
  Assets,
} from 'pixi.js';

import {
  AddActor,
  RemoveActor,
  type AddActorEvent,
  type RemoveActorEvent,
} from '../../../engine/events';
import { WorldSystem, type WorldSystemOptions } from '../../../engine/system';
import { ActorQuery, type Actor } from '../../../engine/actor';
import { type TemplateCollection } from '../../../engine/template';
import { type Scene } from '../../../engine/scene';
import { Transform } from '../../components/transform';
import { Sprite } from '../../components/sprite';
import { Shape } from '../../components/shape';
import { PixiView } from '../../components/pixi-view';
import { BitmapText } from '../../components/bitmap-text';
import { Camera } from '../../components/camera';
import { CameraService } from '../camera-system';
import { CacheStore } from '../../../engine/data-lib';
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
import { loadImage, getAllImageSources, getAllFontSources } from './utils';
import type { Sorting } from './types';
import {
  SpriteBuilder,
  ShapeBuilder,
  PixiViewBuilder,
  BitmapTextBuilder,
} from './builders';
import type { Builder } from './builders';
import { SORTING_ORDER_MAPPING } from './consts';

interface RendererOptions extends WorldSystemOptions {
  windowNodeId: string;
  backgroundColor: string;
}

export class Renderer extends WorldSystem {
  private actorQuery?: ActorQuery;
  private viewEntries?: ViewContainer[];
  private deletedActors: Set<Actor>;
  private window: HTMLElement;
  private application: Application;
  private worldContainer: Container;
  private imageStore: CacheStore<HTMLImageElement>;
  private builders: Map<string, Builder>;
  private sortFn: SortFn;
  private templateCollection: TemplateCollection;
  private backgroundColor: Color;
  private cameraService: CameraService;

  constructor(options: WorldSystemOptions) {
    super();

    const {
      globalOptions,
      windowNodeId,
      backgroundColor,
      templateCollection,
      world,
    } = options as RendererOptions;

    this.templateCollection = templateCollection;
    this.backgroundColor = new Color(backgroundColor);

    this.window = getWindowNode(windowNodeId);

    const sorting = globalOptions.sorting as Sorting | undefined;
    const sortingOrder = SORTING_ORDER_MAPPING[sorting?.order ?? 'bottomRight'];

    this.sortFn = composeSort([
      createSortByLayer(parseSortingLayers(sorting?.layers)),
      sortByYAxis(sortingOrder[1]),
      sortByXAxis(sortingOrder[0]),
    ]);

    this.application = new Application();
    this.worldContainer = new Container({ sortableChildren: true });

    this.imageStore = new CacheStore<HTMLImageElement>();

    this.builders = new Map();
    this.builders.set(
      Sprite.componentName,
      new SpriteBuilder({ imageStore: this.imageStore }),
    );
    this.builders.set(Shape.componentName, new ShapeBuilder());
    this.builders.set(PixiView.componentName, new PixiViewBuilder());
    this.builders.set(BitmapText.componentName, new BitmapTextBuilder());

    this.cameraService = world.getService(CameraService);

    this.deletedActors = new Set();

    world.addService(
      new RendererService({
        application: this.application,
        getViewEntries: (): ViewContainer[] | undefined => this.viewEntries,
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
    const allImageSources = [
      ...getAllImageSources(this.templateCollection.getAll()),
      ...getAllImageSources(scene.children),
    ];
    const uniqueImageSources = [...new Set(allImageSources)];

    const images = await Promise.all(
      uniqueImageSources.map((src) => {
        return !this.imageStore.has(src) ? loadImage(src) : undefined;
      }),
    );

    uniqueImageSources.forEach((src, index) => {
      if (images[index]) {
        this.imageStore.add(src, images[index]!);
      }
    });
    allImageSources.forEach((src) => this.imageStore.retain(src));

    const allFontSources = [
      ...getAllFontSources(this.templateCollection.getAll()),
      ...getAllFontSources(scene.children),
    ];
    const uniqueFontSources = [...new Set(allFontSources)];

    await Assets.load(uniqueFontSources);
  }

  onSceneEnter(scene: Scene): void {
    this.actorQuery = new ActorQuery({
      scene,
      filter: (actor): boolean =>
        Boolean(
          actor.getComponent(Transform) &&
            (actor.getComponent(Sprite) ||
              actor.getComponent(Shape) ||
              actor.getComponent(PixiView) ||
              actor.getComponent(BitmapText)),
        ),
    });

    this.viewEntries = [];
    for (const actor of this.actorQuery.getActors()) {
      this.builders.forEach((builder) => {
        const view = builder.buildView(actor);
        if (view) {
          this.viewEntries?.push(view);
          this.worldContainer.addChild(view);
        }
      });
    }

    this.actorQuery.addEventListener(AddActor, this.handleActorAdd);
    this.actorQuery.addEventListener(RemoveActor, this.handleActorRemove);
  }

  onSceneExit(): void {
    this.actorQuery?.removeEventListener(AddActor, this.handleActorAdd);
    this.actorQuery?.removeEventListener(RemoveActor, this.handleActorRemove);

    this.worldContainer.removeChildren();
    this.application.renderer.clear();

    this.viewEntries?.forEach((entry) => {
      this.builders.get(entry.__dacha.builderKey)!.destroy(entry.__dacha.actor);
    });
    this.viewEntries = undefined;

    this.actorQuery?.destroy();
    this.actorQuery = undefined;
  }

  onSceneDestroy(scene: Scene): void {
    const allSources = [
      ...getAllImageSources(this.templateCollection.getAll()),
      ...getAllImageSources(scene.children),
    ];

    allSources.forEach((src) => this.imageStore.release(src));
    this.imageStore.cleanReleased();
  }

  private handleActorAdd = (event: AddActorEvent): void => {
    const { actor } = event;

    const sprite = actor.getComponent(Sprite);
    if (sprite) {
      const { src } = sprite;

      if (this.imageStore.has(src)) {
        this.imageStore.retain(src);
      } else {
        void loadImage(src).then((image) => {
          if (image) {
            this.imageStore.add(src, image);
            this.imageStore.retain(src);
          }
        });
      }
    }

    const text = actor.getComponent(BitmapText);
    if (text) {
      Assets.load(text.font);
    }

    this.builders.forEach((builder) => {
      const view = builder.buildView(actor);
      if (view) {
        this.viewEntries?.push(view);
        this.worldContainer.addChild(view);
      }
    });

    this.deletedActors.delete(actor);
  };

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;

    const sprite = actor.getComponent(Sprite);
    if (sprite) {
      this.imageStore.release(sprite.src);
    }

    this.deletedActors.add(actor);
  };

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

  private updateViews(): void {
    this.viewEntries?.forEach((view) => {
      this.builders
        .get(view.__dacha.builderKey)!
        .updateView(view.__dacha.actor);
    });
  }

  private updateBounds(): void {
    this.viewEntries?.forEach((view) => {
      if (!view.__dacha.didChange) {
        return;
      }
      const bounds = view.getLocalBounds();
      view.__dacha.bounds.set(
        bounds.minX,
        bounds.minY,
        bounds.maxX,
        bounds.maxY,
      );
      view.updateLocalTransform();
      view.__dacha.bounds.applyMatrix(view.localTransform);
    });
  }

  private sortViews(): void {
    this.viewEntries?.sort(this.sortFn);
    this.viewEntries?.forEach((view, index) => {
      view.zIndex = index;
    });
  }

  private clearDeletedEntries(): void {
    if (this.deletedActors.size === 0) {
      return;
    }

    this.worldContainer.removeChildren();

    this.viewEntries = this.viewEntries?.filter((entry) => {
      if (!this.deletedActors.has(entry.__dacha.actor)) {
        this.worldContainer.addChild(entry);
        return true;
      }

      this.builders.get(entry.__dacha.builderKey)!.destroy(entry.__dacha.actor);
      return false;
    });

    this.deletedActors.clear();
  }

  update(): void {
    this.clearDeletedEntries();

    this.updateCamera();

    this.updateViews();
    this.updateBounds();
    this.sortViews();

    this.application.renderer.render({ container: this.application.stage });
  }
}

Renderer.systemName = 'Renderer';
