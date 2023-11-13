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

import { System } from '../../../engine/system';
import type { SystemOptions } from '../../../engine/system';
import type { GameObject, GameObjectObserver } from '../../../engine/game-object';
import type { TemplateCollection } from '../../../engine/template';
import type { Store } from '../../../engine/scene/store';
import { Transform } from '../../components/transform';
import { Renderable } from '../../components/renderable';
import { Light } from '../../components/light';
import { Camera } from '../../components/camera';
import { MathOps } from '../../../engine/mathLib';
import { filterByKey } from '../../../engine/utils';
import { getWindowNode } from '../../utils/get-window-node';

import { RendererService } from './service';
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
  getImagesFromTemplates,
  getTextureMapKey,
  cloneTexture,
} from './utils';
import { CURRENT_CAMERA_NAME } from './consts';

interface RendererOptions extends SystemOptions {
  windowNodeId: string
  backgroundColor: string
  backgroundAlpha: number
}

export class Renderer extends System {
  private gameObjectObserver: GameObjectObserver;
  private store: Store;
  private window: HTMLElement;
  private renderScene: Scene;
  private currentCamera: OrthographicCamera;
  private renderer: WebGLRenderer;
  private imageCache: Record<string, HTMLImageElement | undefined | null>;
  private spriteCache: Record<string, Record<number, Array<Texture>>>;
  private textureMap: Record<string, Array<Texture>>;
  private gameObjectsMap: Record<string, number>;
  private sortFn: SortFn;
  private lightSubsystem: LightSubsystem;
  private viewWidth: number;
  private viewHeight: number;
  private templateCollection: TemplateCollection;

  constructor(options: SystemOptions) {
    super();

    const {
      globalOptions,
      createGameObjectObserver,
      store,
      windowNodeId,
      backgroundColor,
      backgroundAlpha,
      templateCollection,
      sceneContext,
    } = options as RendererOptions;

    this.gameObjectObserver = createGameObjectObserver({
      components: [
        Renderable,
        Transform,
      ],
    });
    this.store = store;
    this.templateCollection = templateCollection;

    this.window = getWindowNode(windowNodeId);

    this.sortFn = composeSort([
      createSortByLayer(parseSortingLayers(globalOptions.sortingLayers)),
      sortByYAxis,
      sortByXAxis,
      sortByZAxis,
      sortByFit,
    ]);

    this.gameObjectsMap = {};
    this.viewWidth = 0;
    this.viewHeight = 0;

    this.renderScene = new Scene();
    this.currentCamera = new OrthographicCamera();
    this.renderer = new WebGLRenderer();
    this.renderer.setClearColor(new Color(backgroundColor), backgroundAlpha);

    this.lightSubsystem = new LightSubsystem(
      this.renderScene,
      createGameObjectObserver({
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

    sceneContext.registerService(new RendererService({
      scene: this.renderScene,
      camera: this.currentCamera,
      window: this.window,
      sortFn: this.sortFn,
    }));
  }

  async load(): Promise<void> {
    const imagesToLoad = this.getImagesToLoad();

    await Promise.all(
      Object.keys(imagesToLoad).map((key) => this.loadImage(imagesToLoad[key])),
    );
  }

  private async loadImage(renderable: Renderable): Promise<void> {
    const { src, slice } = renderable;

    this.imageCache[src] = null;
    return loadImage(renderable)
      .then((image) => {
        this.imageCache[src] = image;

        const sprite = prepareSprite(image, renderable);
        this.spriteCache[src] ??= {};
        this.spriteCache[src][slice] = sprite;
        this.textureMap[getTextureMapKey(renderable)] = sprite.map(
          (frame) => cloneTexture(renderable, frame),
        );
      })
      .catch(() => {
        console.warn(`Can't load image by the following url: ${src}`);
      });
  }

  private getTextureArray(renderable: Renderable): Array<Texture> | undefined {
    const { src, slice } = renderable;
    const image = this.imageCache[src];

    if (image === null) {
      return void 0;
    }
    if (image === undefined) {
      void this.loadImage(renderable);
      return void 0;
    }

    if (image && !this.spriteCache[src][slice]) {
      this.spriteCache[src][slice] = prepareSprite(image, renderable);
    }
    const textureKey = getTextureMapKey(renderable);
    if (image && this.spriteCache[src][slice] && !this.textureMap[textureKey]) {
      this.textureMap[textureKey] = this.spriteCache[src][slice].map(
        (frame) => cloneTexture(renderable, frame),
      );
    }

    return this.textureMap[textureKey];
  }

  mount(): void {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);

    this.gameObjectObserver.subscribe('onadd', this.handleGameObjectAdd);
    this.gameObjectObserver.subscribe('onremove', this.handleGameObjectRemove);

    this.lightSubsystem.mount();

    this.window.appendChild(this.renderer.domElement);
  }

  unmount(): void {
    window.removeEventListener('resize', this.handleWindowResize);

    this.gameObjectObserver.unsubscribe('onadd', this.handleGameObjectAdd);
    this.gameObjectObserver.unsubscribe('onremove', this.handleGameObjectRemove);

    this.lightSubsystem.unmount();

    this.window.removeChild(this.renderer.domElement);
  }

  private getImagesToLoad(): Record<string, Renderable> {
    const imagesToLoad: Record<string, Renderable> = {};

    this.templateCollection.getAll().forEach(
      (template) => getImagesFromTemplates(imagesToLoad, template),
    );

    this.gameObjectObserver.getList()
      .reduce((acc: Record<string, Renderable>, gameObject) => {
        const renderable = gameObject.getComponent(Renderable);

        if (!acc[renderable.src]) {
          acc[renderable.src] = renderable;
        }

        return acc;
      }, imagesToLoad);

    return imagesToLoad;
  }

  private handleGameObjectAdd = (gameObject: GameObject): void => {
    const renderable = gameObject.getComponent(Renderable);

    const material = createMaterial(renderable.material.type);
    const geometry = new PlaneGeometry(renderable.width, renderable.height);
    const object = new Mesh(geometry, material);

    object.userData.gameObject = gameObject;
    this.gameObjectsMap[gameObject.getId()] = object.id;

    this.renderScene.add(object);
  };

  private handleGameObjectRemove = (gameObject: GameObject): void => {
    const gameObjectId = gameObject.getId();
    const object = this.renderScene.getObjectById(this.gameObjectsMap[gameObjectId]);

    if (object) {
      this.renderScene.remove(object);
    }

    this.gameObjectsMap = filterByKey(this.gameObjectsMap, gameObjectId);
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

  private updateCamera(): void {
    const currentCamera = this.store.get(CURRENT_CAMERA_NAME) as GameObject;
    const transform = currentCamera.getComponent(Transform);
    const { zoom } = currentCamera.getComponent(Camera);

    this.currentCamera.zoom = zoom;
    // TODO: Figure out how to set up camera correctly to avoid negative transform by y axis
    this.currentCamera.position.set(transform.offsetX, -transform.offsetY, 1);

    this.currentCamera.updateProjectionMatrix();
  }

  private updateGameObjects(): void {
    this.gameObjectObserver.getList().forEach((gameObject, index) => {
      const transform = gameObject.getComponent(Transform);
      const renderable = gameObject.getComponent(Renderable);

      const object = this.renderScene.getObjectById(
        this.gameObjectsMap[gameObject.getId()],
      ) as Mesh;

      if (!object) {
        return;
      }

      object.visible = !renderable.disabled;
      if (!object.visible) {
        return;
      }

      object.scale.set(
        (renderable.flipX ? -1 : 1) * transform.scaleX,
        (renderable.flipY ? -1 : 1) * transform.scaleY,
        1,
      );
      object.rotation.set(0, 0, MathOps.degToRad(transform.rotation + renderable.rotation));
      object.position.set(transform.offsetX, transform.offsetY, 0);
      object.renderOrder = index;

      const material = object.material as MeshStandardMaterial;

      const textureArray = this.getTextureArray(renderable);
      const texture = textureArray?.[renderable.currentFrame || 0];

      updateMaterial(renderable.material.type, material, renderable.material.options, texture);
    });
  }

  update(): void {
    this.gameObjectObserver.fireEvents();

    this.updateCamera();

    this.lightSubsystem.update();

    this.gameObjectObserver.getList().sort(this.sortFn);
    this.updateGameObjects();

    this.renderer.render(this.renderScene, this.currentCamera);
  }
}

Renderer.systemName = 'Renderer';
