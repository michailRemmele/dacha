import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  MeshBasicMaterial,
  PlaneGeometry,
  Mesh,
  Color,
} from 'three';

import type { GameObject, GameObjectObserver } from '../../../engine/gameObject';
import type { Store } from '../../../engine/scene/store';
import type { Transform } from '../../components/transform';
import type { Renderable } from '../../components/renderable';
import type { Camera } from '../../components/camera';
import {
  composeSort,
  SortFn,
  createSortByLayer,
  sortByYAxis,
  sortByXAxis,
  sortByZAxis,
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
}

export class ThreeJSRenderer {
  private gameObjectObserver: GameObjectObserver;
  private store: Store;
  private window: HTMLElement;
  private renderScene: Scene;
  private currentCamera: OrthographicCamera;
  private renderer: WebGLRenderer;
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
    } = options;

    this.gameObjectObserver = gameObjectObserver;
    this.store = store;
    this.window = window;

    this.sortFn = composeSort([
      createSortByLayer(sortingLayers),
      sortByYAxis,
      sortByXAxis,
      sortByZAxis,
    ]);

    this.gameObjectsMap = {};
    this.viewWidth = 0;
    this.viewHeight = 0;

    this.matrixTransformer = new MatrixTransformer();
    this.renderScene = new Scene();
    this.currentCamera = new OrthographicCamera();
    this.renderer = new WebGLRenderer();

    this.currentCamera.position.set(0, 0, 1);
    this.renderScene.matrixAutoUpdate = false;

    this.window.appendChild(this.renderer.domElement);
  }

  processorDidMount() {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);

    this.gameObjectObserver.subscribe('onadd', this.handleGameObjectAdd);
    this.gameObjectObserver.subscribe('onremove', this.handleGameObjectRemove);
  }

  processorWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);

    this.gameObjectObserver.unsubscribe('onadd', this.handleGameObjectAdd);
    this.gameObjectObserver.unsubscribe('onremove', this.handleGameObjectRemove);
  }

  private handleGameObjectAdd = (gameObject: GameObject) => {
    const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;

    const material = new MeshBasicMaterial({
      color: new Color(Math.random(), Math.random(), Math.random()),
    });
    const geometry = new PlaneGeometry(renderable.width, renderable.height);
    const object = new Mesh(geometry, material);

    object.userData.gameObject = gameObject;
    this.gameObjectsMap[gameObject.getId()] = object.id;

    this.renderScene.add(object);
  };

  private handleGameObjectRemove = (gameObject: GameObject) => {
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

  private handleWindowResize = () => {
    this.viewWidth = this.window.clientWidth;
    this.viewHeight = this.window.clientHeight;

    this.currentCamera.left = this.viewWidth / -2;
    this.currentCamera.top = this.viewHeight / 2;
    this.currentCamera.right = this.viewWidth / 2;
    this.currentCamera.bottom = this.viewHeight / -2;

    this.renderer.setSize(this.viewWidth, this.viewHeight);
  };

  private updateViewMatrix() {
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

  private updateGameObjects() {
    this.gameObjectObserver.getList().forEach((gameObject, index) => {
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
      const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;

      const object = this.renderScene.getObjectById(this.gameObjectsMap[gameObject.getId()]);

      if (!object) {
        return;
      }

      object.position.set(transform.offsetX, transform.offsetY, transform.offsetZ);

      object.visible = !renderable.disabled;
      object.renderOrder = index;
    });
  }

  process() {
    this.gameObjectObserver.fireEvents();

    this.updateViewMatrix();

    this.gameObjectObserver.getList().sort(this.sortFn);
    this.updateGameObjects();

    this.renderer.render(this.renderScene, this.currentCamera);
  }
}
