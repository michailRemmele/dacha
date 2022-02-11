import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  MeshBasicMaterial,
  PlaneGeometry,
  Mesh,
  Texture,
  NearestFilter,
  RepeatWrapping,
  ClampToEdgeWrapping,
  Color,
} from 'three';

import type { GameObject, GameObjectObserver } from '../../../engine/gameObject';
import type { Store } from '../../../engine/scene/store';
import type { Transform } from '../../components/transform';
import type { Renderable } from '../../components/renderable';
import type { Camera } from '../../components/camera';
import { MathOps } from '../../../engine/mathLib';
import {
  composeSort,
  SortFn,
  createSortByLayer,
  sortByYAxis,
  sortByXAxis,
  sortByZAxis,
  sortByFit,
} from '../render-processor/sort';

import { MatrixTransformer } from './matrix-transformer';
import {
  CAMERA_COMPONENT_NAME,
  CURRENT_CAMERA_NAME,
  TRANSFORM_COMPONENT_NAME,
  RENDERABLE_COMPONENT_NAME,
} from './consts';

interface RendererOptions {
  gameObjectObserver: GameObjectObserver
  store: Store
  window: HTMLElement
  sortingLayers: Array<string>
  backgroundColor: string
  textureMap: Record<string, Array<Texture>>
}

export class ThreeJSRenderer {
  private gameObjectObserver: GameObjectObserver;
  private store: Store;
  private window: HTMLElement;
  private renderScene: Scene;
  private currentCamera: OrthographicCamera;
  private renderer: WebGLRenderer;
  private textureMap: Record<string, Array<Texture>>;
  private gameObjectsMap: Record<string, number>;
  private sortFn: SortFn;
  private matrixTransformer: MatrixTransformer;
  private viewWidth: number;
  private viewHeight: number;

  constructor(options: RendererOptions) {
    const {
      gameObjectObserver,
      store,
      window,
      sortingLayers,
      backgroundColor,
      textureMap,
    } = options;

    this.gameObjectObserver = gameObjectObserver;
    this.store = store;
    this.window = window;

    this.sortFn = composeSort([
      createSortByLayer(sortingLayers),
      sortByYAxis,
      sortByXAxis,
      sortByZAxis,
      sortByFit,
    ]);

    this.gameObjectsMap = {};
    this.viewWidth = 0;
    this.viewHeight = 0;

    this.matrixTransformer = new MatrixTransformer();
    this.renderScene = new Scene();
    this.currentCamera = new OrthographicCamera();
    this.renderer = new WebGLRenderer();
    this.renderer.setClearColor(new Color(backgroundColor));

    this.currentCamera.position.set(0, 0, 1);
    this.renderScene.matrixAutoUpdate = false;

    this.window.appendChild(this.renderer.domElement);

    this.textureMap = textureMap;
    Object.keys(this.textureMap).forEach((key) => {
      this.textureMap[key].forEach((texture) => {
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.flipY = false;
      });
    });
  }

  processorDidMount(): void {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);

    this.gameObjectObserver.subscribe('onadd', this.handleGameObjectAdd);
    this.gameObjectObserver.subscribe('onremove', this.handleGameObjectRemove);
  }

  processorWillUnmount(): void {
    window.removeEventListener('resize', this.handleWindowResize);

    this.gameObjectObserver.unsubscribe('onadd', this.handleGameObjectAdd);
    this.gameObjectObserver.unsubscribe('onremove', this.handleGameObjectRemove);
  }

  private handleGameObjectAdd = (gameObject: GameObject): void => {
    const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;

    const material = new MeshBasicMaterial({
      transparent: true,
      map: this.textureMap[renderable.src][renderable.currentFrame || 0],
    });
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

    this.gameObjectsMap = Object.keys(this.gameObjectsMap)
      .reduce((acc: Record<string, number>, key) => {
        if (key !== gameObjectId) {
          acc[key] = this.gameObjectsMap[key];
        }

        return acc;
      }, {});
  };

  private handleWindowResize = (): void => {
    this.viewWidth = this.window.clientWidth;
    this.viewHeight = this.window.clientHeight;

    this.currentCamera.left = this.viewWidth / -2;
    this.currentCamera.top = this.viewHeight / 2;
    this.currentCamera.right = this.viewWidth / 2;
    this.currentCamera.bottom = this.viewHeight / -2;

    this.renderer.setSize(this.viewWidth, this.viewHeight);
  };

  private updateViewMatrix(): void {
    const currentCamera = this.store.get(CURRENT_CAMERA_NAME) as GameObject;
    const transform = currentCamera.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
    const { zoom } = currentCamera.getComponent(CAMERA_COMPONENT_NAME) as Camera;
    const scale = zoom;

    const viewMatrix = this.matrixTransformer.getIdentityMatrix();

    this.matrixTransformer.translate(viewMatrix, -transform.offsetX, -transform.offsetY, 0);
    this.matrixTransformer.scale(viewMatrix, scale, scale, 1);
    this.matrixTransformer.project(viewMatrix, this.viewWidth, this.viewHeight, 1);
    this.renderScene.matrixWorld.fromArray(viewMatrix);
  }

  private updateGameObjects(): void {
    this.gameObjectObserver.getList().forEach((gameObject, index) => {
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
      const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;

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

      if (!this.textureMap[renderable.src]) {
        return;
      }

      const material = object.material as MeshBasicMaterial;
      const texture = this.textureMap[renderable.src][renderable.currentFrame || 0];

      material.map = texture;

      if (renderable.fit === 'repeat') {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;

        texture.repeat.set(
          renderable.width / (texture.image as HTMLImageElement).width,
          renderable.height / (texture.image as HTMLImageElement).height,
        );
      } else {
        texture.wrapS = ClampToEdgeWrapping;
        texture.wrapT = ClampToEdgeWrapping;

        texture.repeat.set(1, 1);
      }
    });
  }

  process(): void {
    this.gameObjectObserver.fireEvents();

    this.updateViewMatrix();

    this.gameObjectObserver.getList().sort(this.sortFn);
    this.updateGameObjects();

    this.renderer.render(this.renderScene, this.currentCamera);
  }
}
