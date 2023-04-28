import { Raycaster, Vector2 } from 'three/src/Three';
import type { Scene, Camera } from 'three/src/Three';

import type { GameObject } from '../../../../engine/game-object';

interface RendererServiceOptions {
  scene: Scene;
  camera: Camera;
}

export class RendererService {
  private scene: Scene;
  private camera: Camera;
  private raycaster: Raycaster;

  constructor({
    scene,
    camera,
  }: RendererServiceOptions) {
    this.scene = scene;
    this.camera = camera;

    this.raycaster = new Raycaster();
  }

  intersectsWithPoint(x: number, y: number): Array<GameObject> {
    const vector = new Vector2(x, y);

    this.raycaster.setFromCamera(vector, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    return intersects.map((intersect) => intersect.object.userData.gameObject as GameObject);
  }
}
