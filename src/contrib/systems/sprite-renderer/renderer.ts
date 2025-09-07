import {
  Scene as ThreeJSScene,
  OrthographicCamera,
  WebGLRenderer,
  MeshStandardMaterial,
  PlaneGeometry,
  Mesh,
  Texture,
  Color,
} from 'three/src/Three';

import { AddActor, RemoveActor } from '../../../engine/events';
import type { AddActorEvent, RemoveActorEvent } from '../../../engine/events';
import { WorldSystem } from '../../../engine/system';
import type { WorldSystemOptions } from '../../../engine/system';
import { Actor, ActorCollection } from '../../../engine/actor';
import type { TemplateCollection } from '../../../engine/template';
import type { Scene } from '../../../engine/scene';
import { Transform } from '../../components/transform';
import { Sprite } from '../../components/sprite';
import { Camera } from '../../components/camera';
import { CameraService } from '../camera-system';
import { MathOps } from '../../../engine/math-lib';
import { CacheStore } from '../../../engine/data-lib';
import { getWindowNode } from '../../utils/get-window-node';

import { SpriteRendererService } from './service';
import {
  composeSort,
  SortFn,
  createSortByLayer,
  sortByYAxis,
  sortByXAxis,
  sortByZAxis,
  sortByFit,
} from './sort';
import { parseSortingLayers } from './sort/utils';
import { LightSubsystem } from './light-subsystem';
import { createMaterial, updateMaterial } from './material-factory';
import {
  loadImage,
  prepareSprite,
  getAllSources,
  getTextureMapKey,
  cloneTexture,
} from './utils';
import type { SortingLayers } from './types';

interface RendererOptions extends WorldSystemOptions {
  windowNodeId: string
  backgroundColor: string
  backgroundAlpha: number
}

export class SpriteRenderer extends WorldSystem {
  private actorCollection?: ActorCollection;
  private window: HTMLElement;
  private renderScene: ThreeJSScene;
  private currentCamera: OrthographicCamera;
  private renderer: WebGLRenderer;
  private imageStore: CacheStore<HTMLImageElement>;
  private spriteCache: Map<string, Record<number, Texture[]>>;
  private textureMap: Map<string, Texture[]>;
  private actorsMap: Map<string, number>;
  private sortFn: SortFn;
  private lightSubsystem: LightSubsystem;
  private viewWidth: number;
  private viewHeight: number;
  private templateCollection: TemplateCollection;
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

    this.window = getWindowNode(windowNodeId);

    this.sortFn = composeSort([
      createSortByLayer(parseSortingLayers((globalOptions.sortingLayers as SortingLayers)?.layers)),
      sortByYAxis,
      sortByXAxis,
      sortByZAxis,
      sortByFit,
    ]);

    this.viewWidth = 0;
    this.viewHeight = 0;

    this.renderScene = new ThreeJSScene();
    this.currentCamera = new OrthographicCamera();
    this.renderer = new WebGLRenderer();
    this.renderer.setClearColor(new Color(backgroundColor), backgroundAlpha);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.lightSubsystem = new LightSubsystem(this.renderScene);

    // TODO: Figure out how to set up camera correctly to avoid scale usage
    this.renderScene.scale.set(1, -1, 1);

    this.imageStore = new CacheStore<HTMLImageElement>();
    this.actorsMap = new Map();
    this.spriteCache = new Map();
    this.textureMap = new Map();

    this.cameraService = world.getService(CameraService);

    world.addService(new SpriteRendererService({
      threeScene: this.renderScene,
      threeCamera: this.currentCamera,
      window: this.window,
      sortFn: this.sortFn,
      cameraService: this.cameraService,
    }));

    window.addEventListener('resize', this.handleWindowResize);

    this.window.appendChild(this.renderer.domElement);
  }

  async onSceneLoad(scene: Scene): Promise<void> {
    const allSources = [
      ...getAllSources(this.templateCollection.getAll()),
      ...getAllSources(scene.children),
    ];
    const uniqueSources = [...new Set(allSources)];

    const images = await Promise.all(uniqueSources.map((src) => {
      return !this.imageStore.has(src) ? this.loadImage(src) : undefined;
    }));

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

    this.handleWindowResize();

    this.lightSubsystem.onSceneEnter(scene);

    this.actorCollection.addEventListener(AddActor, this.handleActorAdd);
    this.actorCollection.addEventListener(RemoveActor, this.handleActorRemove);
  }

  onSceneExit(): void {
    this.actorCollection?.removeEventListener(AddActor, this.handleActorAdd);
    this.actorCollection?.removeEventListener(RemoveActor, this.handleActorRemove);

    this.lightSubsystem.onSceneExit();

    this.actorsMap.clear();
    this.spriteCache.clear();
    this.textureMap.clear();

    this.renderScene.clear();

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

  onWorldDestroy(): void {
    window.removeEventListener('resize', this.handleWindowResize);

    this.window.removeChild(this.renderer.domElement);
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

    const { src } = actor.getComponent(Sprite);
    this.imageStore.release(src);

    const objectId = this.actorsMap.get(actor.id);

    if (objectId) {
      const object = this.renderScene.getObjectById(objectId);
      if (object) {
        this.renderScene.remove(object);
      }
    }

    this.actorsMap.delete(actor.id);
  };

  private handleWindowResize = (): void => {
    this.viewWidth = this.window.clientWidth;
    this.viewHeight = this.window.clientHeight;

    this.currentCamera.left = this.viewWidth / -2;
    this.currentCamera.top = this.viewHeight / 2;
    this.currentCamera.right = this.viewWidth / 2;
    this.currentCamera.bottom = this.viewHeight / -2;

    this.currentCamera.updateProjectionMatrix();

    this.renderer.setSize(this.viewWidth, this.viewHeight);
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

  private getTextureArray(sprite: Sprite): Texture[] | undefined {
    const { src, slice } = sprite;
    const image = this.imageStore.get(src);

    if (!image) {
      return undefined;
    }

    if (!this.spriteCache.has(src)) {
      this.spriteCache.set(src, {});
    }

    const spriteCache = this.spriteCache.get(src)!;
    if (!spriteCache[slice]) {
      spriteCache[slice] = prepareSprite(image, sprite);
    }
    const textureKey = getTextureMapKey(sprite);
    if (!this.textureMap.has(textureKey)) {
      this.textureMap.set(textureKey, spriteCache[slice].map(
        (frame) => cloneTexture(sprite, frame),
      ));
    }

    return this.textureMap.get(textureKey);
  }

  private setUpActor(actor: Actor): void {
    const sprite = actor.getComponent(Sprite);

    const material = createMaterial();
    const geometry = new PlaneGeometry(sprite.width, sprite.height);
    const object = new Mesh(geometry, material);

    object.userData.actor = actor;
    this.actorsMap.set(actor.id, object.id);

    this.renderScene.add(object);
  }

  private normalizeOffset(value: number): number {
    const currentCamera = this.cameraService.getCurrentCamera();
    const camera = currentCamera?.getComponent(Camera);
    const zoom = camera?.zoom ?? 1;

    const ratio = 1 / (window.devicePixelRatio * zoom);
    return Math.round(value / ratio) * ratio;
  }

  private updateCamera(): void {
    const currentCamera = this.cameraService.getCurrentCamera();
    const transform = currentCamera?.getComponent(Transform);
    const camera = currentCamera?.getComponent(Camera);

    const offsetX = transform?.offsetX ?? 0;
    const offsetY = transform?.offsetY ?? 0;
    const zoom = camera?.zoom ?? 1;

    this.currentCamera.zoom = zoom;
    // TODO: Figure out how to set up camera correctly to avoid negative transform by y axis
    this.currentCamera.position.set(
      this.normalizeOffset(offsetX),
      -this.normalizeOffset(offsetY),
      1,
    );

    this.currentCamera.updateProjectionMatrix();
  }

  private updateActors(): void {
    this.actorCollection?.forEach((actor, index) => {
      const transform = actor.getComponent(Transform);
      const sprite = actor.getComponent(Sprite);

      if (!this.actorsMap.has(actor.id)) {
        this.setUpActor(actor);
      }

      const object = this.renderScene.getObjectById(
        this.actorsMap.get(actor.id)!,
      ) as Mesh;

      if (!object) {
        return;
      }

      object.visible = !sprite.disabled;
      if (!object.visible) {
        return;
      }

      object.scale.set(
        (sprite.flipX ? -1 : 1) * transform.scaleX,
        (sprite.flipY ? -1 : 1) * transform.scaleY,
        1,
      );
      object.rotation.set(0, 0, MathOps.degToRad(transform.rotation + sprite.rotation));
      object.position.set(
        this.normalizeOffset(transform.offsetX),
        this.normalizeOffset(transform.offsetY),
        0,
      );
      object.renderOrder = index;

      const material = object.material as MeshStandardMaterial;

      const textureArray = this.getTextureArray(sprite);
      const texture = textureArray?.[sprite.currentFrame || 0];

      updateMaterial(sprite, material, texture);
    });
  }

  update(): void {
    this.updateCamera();

    this.lightSubsystem.update();

    this.actorCollection?.sort(this.sortFn);
    this.updateActors();

    this.renderer.render(this.renderScene, this.currentCamera);
  }
}

SpriteRenderer.systemName = 'SpriteRenderer';
