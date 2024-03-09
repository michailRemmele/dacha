import { Raycaster, Vector2 } from 'three/src/Three';
import type { Scene, Camera } from 'three/src/Three';

import type { Actor } from '../../../../engine/actor';
import type { SortFn } from '../sort';

interface SpriteRendererServiceOptions {
  scene: Scene
  camera: Camera
  window: HTMLElement
  sortFn: SortFn
}

export class SpriteRendererService {
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
  }: SpriteRendererServiceOptions) {
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

  intersectsWithPoint(x: number, y: number): Array<Actor> {
    this.raycaster.setFromCamera(this.getNormalizedCoordinates(x, y), this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    const actors = intersects.map(
      (intersect) => intersect.object.userData.actor as Actor,
    );

    // TODO: Find more efficient way to return intersected objects in right order
    // according to posititon and sorting layer
    return actors
      .sort(this.sortFn)
      .reverse();
  }
}
