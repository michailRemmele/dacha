import { Raycaster, Vector2 } from 'three/src/Three';
import type { Scene, Camera } from 'three/src/Three';

import type { GameObject } from '../../../../engine/game-object';
import type { SortFn } from '../sort';

interface RendererServiceOptions {
  scene: Scene
  camera: Camera
  window: HTMLElement
  sortFn: SortFn
}

export class RendererService {
  private scene: Scene;
  private camera: Camera;
  private window: HTMLElement;
  private raycaster: Raycaster;
  private sortFn: SortFn;

  constructor({
    scene,
    camera,
    window,
    sortFn,
  }: RendererServiceOptions) {
    this.scene = scene;
    this.camera = camera;
    this.window = window;
    this.sortFn = sortFn;

    this.raycaster = new Raycaster();
  }

  private getNormalizedCoordinates(x: number, y: number): Vector2 {
    const { clientWidth, clientHeight } = this.window;

    return new Vector2(
      (x / clientWidth) * 2 - 1,
      -(y / clientHeight) * 2 + 1,
    );
  }

  intersectsWithPoint(x: number, y: number): Array<GameObject> {
    this.raycaster.setFromCamera(this.getNormalizedCoordinates(x, y), this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    const gameObjects = intersects.map(
      (intersect) => intersect.object.userData.gameObject as GameObject,
    );

    // TODO: Find more efficient way to return intersected objects in right order
    // according to posititon and sorting layer
    return gameObjects
      .sort(this.sortFn)
      .reverse();
  }
}
