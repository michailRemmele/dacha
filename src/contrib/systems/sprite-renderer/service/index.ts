import { Raycaster, Vector2 } from 'three/src/Three';
import type { Scene, Camera } from 'three/src/Three';

import { getProjectedX, getProjectedY } from '../../../utils/coordinates-projection';
import type { CameraService } from '../../camera-system';
import type { Actor } from '../../../../engine/actor';
import type { SortFn } from '../sort';

interface SpriteRendererServiceOptions {
  threeScene: Scene
  threeCamera: Camera
  window: HTMLElement
  sortFn: SortFn
  cameraService: CameraService
}

export class SpriteRendererService {
  private threeScene: Scene;
  private threeCamera: Camera;
  private window: HTMLElement;
  private raycaster: Raycaster;
  private sortFn: SortFn;
  private cameraService: CameraService;

  constructor({
    threeScene,
    threeCamera,
    window,
    sortFn,
    cameraService,
  }: SpriteRendererServiceOptions) {
    this.threeScene = threeScene;
    this.threeCamera = threeCamera;
    this.window = window;
    this.sortFn = sortFn;
    this.cameraService = cameraService;

    this.raycaster = new Raycaster();
  }

  private getNormalizedCoordinates(x: number, y: number): Vector2 {
    const { clientWidth, clientHeight } = this.window;

    return new Vector2(
      (x / clientWidth) * 2 - 1,
      -(y / clientHeight) * 2 + 1,
    );
  }

  intersectsWithPoint(x: number, y: number): Actor[] {
    this.raycaster.setFromCamera(this.getNormalizedCoordinates(x, y), this.threeCamera);
    const intersects = this.raycaster.intersectObjects(this.threeScene.children, true);

    const actors = intersects.map(
      (intersect) => intersect.object.userData.actor as Actor,
    );

    // TODO: Find more efficient way to return intersected objects in right order
    // according to posititon and sorting layer
    return actors
      .sort(this.sortFn)
      .reverse();
  }

  intersectsWithRectangle(minX: number, minY: number, maxX: number, maxY: number): Actor[] {
    const actors: Actor[] = [];

    const camera = this.cameraService.getCurrentCamera();
    if (!camera) {
      return actors;
    }

    const projectedMinX = getProjectedX(minX, camera);
    const projectedMinY = getProjectedY(minY, camera);
    const projectedMaxX = getProjectedX(maxX, camera);
    const projectedMaxY = getProjectedY(maxY, camera);

    this.threeScene.traverse((object) => {
      if (object.userData.actor !== undefined) {
        const { x, y } = object.position;
        if (x >= projectedMinX && x <= projectedMaxX && y >= projectedMinY && y <= projectedMaxY) {
          actors.push(object.userData.actor as Actor);
        }
      }
    });
    return actors;
  }
}
