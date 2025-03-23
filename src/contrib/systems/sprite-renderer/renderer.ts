import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  MeshStandardMaterial,
  PlaneGeometry,
  Mesh,
  Texture,
  Color,
} from 'three/src/Three';

import { RemoveActor } from '../../../engine/events';
import type { RemoveActorEvent } from '../../../engine/events';
import { System } from '../../../engine/system';
import type { SystemOptions } from '../../../engine/system';
import { Actor, ActorCollection } from '../../../engine/actor';
import type { TemplateCollection } from '../../../engine/template';
import { Transform } from '../../components/transform';
import { Sprite } from '../../components/sprite';
import { Light } from '../../components/light';
import { Camera } from '../../components/camera';
import { CameraService } from '../camera-system';
import { MathOps } from '../../../engine/math-lib';
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
  getImagesFromTemplate,
  getTextureMapKey,
  cloneTexture,
} from './utils';
import type { SortingLayers } from './types';

interface RendererOptions extends SystemOptions {
  windowNodeId: string
  backgroundColor: string
  backgroundAlpha: number
}

export class SpriteRenderer extends System {
  private actorCollection: ActorCollection;
  private window: HTMLElement;
  private renderScene: Scene;
  private currentCamera: OrthographicCamera;
  private renderer: WebGLRenderer;
  private imageCache: Record<string, HTMLImageElement | undefined | null>;
  private spriteCache: Record<string, Record<number, Array<Texture>>>;
  private textureMap: Record<string, Array<Texture>>;
  private actorsMap: Record<string, number>;
  private sortFn: SortFn;
  private lightSubsystem: LightSubsystem;
  private viewWidth: number;
  private viewHeight: number;
  private templateCollection: TemplateCollection;
  private cameraService: CameraService;

  constructor(options: SystemOptions) {
    super();

    const {
      globalOptions,
      windowNodeId,
      backgroundColor,
      backgroundAlpha,
      templateCollection,
      scene,
    } = options as RendererOptions;

    this.actorCollection = new ActorCollection(scene, {
      components: [
        Sprite,
        Transform,
      ],
    });
    this.templateCollection = templateCollection;

    this.window = getWindowNode(windowNodeId);

    this.sortFn = composeSort([
      createSortByLayer(parseSortingLayers((globalOptions.sortingLayers as SortingLayers)?.layers)),
      sortByYAxis,
      sortByXAxis,
      sortByZAxis,
      sortByFit,
    ]);

    this.actorsMap = {};
    this.viewWidth = 0;
    this.viewHeight = 0;

    this.renderScene = new Scene();
    this.currentCamera = new OrthographicCamera();
    this.renderer = new WebGLRenderer();
    this.renderer.setClearColor(new Color(backgroundColor), backgroundAlpha);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.lightSubsystem = new LightSubsystem(
      this.renderScene,
      new ActorCollection(scene, {
        components: [
          Light,
          Transform,
        ],
      }),
    );

    // TODO: Figure out how to set up camera correctly to avoid scale usage
    this.renderScene.scale.set(1, -1, 1);

    this.imageCache = {};
    this.spriteCache = {};
    this.textureMap = {};

    this.cameraService = scene.getService(CameraService);

    scene.addService(new SpriteRendererService({
      threeScene: this.renderScene,
      threeCamera: this.currentCamera,
      window: this.window,
      sortFn: this.sortFn,
      cameraService: this.cameraService,
    }));
  }

  async load(): Promise<void> {
    const imagesToLoad = this.getImagesToLoad();

    await Promise.all(
      Object.keys(imagesToLoad).map((key) => this.loadImage(imagesToLoad[key])),
    );
  }

  private async loadImage(sprite: Sprite): Promise<void> {
    const { src, slice } = sprite;

    this.imageCache[src] = null;
    return loadImage(sprite)
      .then((image) => {
        this.imageCache[src] = image;

        const spriteTextures = prepareSprite(image, sprite);
        this.spriteCache[src] ??= {};
        this.spriteCache[src][slice] = spriteTextures;
        this.textureMap[getTextureMapKey(sprite)] = spriteTextures.map(
          (frame) => cloneTexture(sprite, frame),
        );
      })
      .catch(() => {
        console.warn(`Can't load image by the following url: ${src}`);
      });
  }

  private getTextureArray(sprite: Sprite): Array<Texture> | undefined {
    const { src, slice } = sprite;
    const image = this.imageCache[src];

    if (image === null) {
      return void 0;
    }
    if (image === undefined) {
      void this.loadImage(sprite);
      return void 0;
    }

    if (image && !this.spriteCache[src][slice]) {
      this.spriteCache[src][slice] = prepareSprite(image, sprite);
    }
    const textureKey = getTextureMapKey(sprite);
    if (image && this.spriteCache[src][slice] && !this.textureMap[textureKey]) {
      this.textureMap[textureKey] = this.spriteCache[src][slice].map(
        (frame) => cloneTexture(sprite, frame),
      );
    }

    return this.textureMap[textureKey];
  }

  mount(): void {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);

    this.actorCollection.addEventListener(RemoveActor, this.handleActorRemove);

    this.lightSubsystem.mount();

    this.window.appendChild(this.renderer.domElement);
  }

  unmount(): void {
    window.removeEventListener('resize', this.handleWindowResize);

    this.actorCollection.removeEventListener(RemoveActor, this.handleActorRemove);

    this.lightSubsystem.unmount();

    this.window.removeChild(this.renderer.domElement);
  }

  private getImagesToLoad(): Record<string, Sprite> {
    const imagesToLoad: Record<string, Sprite> = {};

    this.templateCollection.getAll().forEach(
      (template) => getImagesFromTemplate(imagesToLoad, template),
    );

    this.actorCollection.forEach((actor) => {
      const sprite = actor.getComponent(Sprite);

      if (!imagesToLoad[sprite.src]) {
        imagesToLoad[sprite.src] = sprite;
      }
    });

    return imagesToLoad;
  }

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;
    const object = this.renderScene.getObjectById(this.actorsMap[actor.id]);

    if (object) {
      this.renderScene.remove(object);
    }

    delete this.actorsMap[actor.id];
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

  private setUpActor(actor: Actor): void {
    const sprite = actor.getComponent(Sprite);

    const material = createMaterial(sprite.material.type);
    const geometry = new PlaneGeometry(sprite.width, sprite.height);
    const object = new Mesh(geometry, material);

    object.userData.actor = actor;
    this.actorsMap[actor.id] = object.id;

    this.renderScene.add(object);
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
    this.currentCamera.position.set(offsetX, -offsetY, 1);

    this.currentCamera.updateProjectionMatrix();
  }

  private updateActors(): void {
    this.actorCollection.forEach((actor, index) => {
      const transform = actor.getComponent(Transform);
      const sprite = actor.getComponent(Sprite);

      if (!this.actorsMap[actor.id]) {
        this.setUpActor(actor);
      }

      const object = this.renderScene.getObjectById(
        this.actorsMap[actor.id],
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
      object.position.set(transform.offsetX, transform.offsetY, 0);
      object.renderOrder = index;

      const material = object.material as MeshStandardMaterial;

      const textureArray = this.getTextureArray(sprite);
      const texture = textureArray?.[sprite.currentFrame || 0];

      updateMaterial(sprite.material.type, material, sprite.material.options, texture);
    });
  }

  update(): void {
    this.updateCamera();

    this.lightSubsystem.update();

    this.actorCollection.sort(this.sortFn);
    this.updateActors();

    this.renderer.render(this.renderScene, this.currentCamera);
  }
}

SpriteRenderer.systemName = 'SpriteRenderer';
