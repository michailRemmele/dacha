import { SceneSystem, Transform, Camera, Vector2 } from 'dacha';
import type { World, SceneSystemOptions, Actor } from 'dacha';
import type { MouseControlEvent } from 'dacha/events';

import { CANVAS_ROOT } from '../../../consts/root-nodes';
import { EventType } from '../../../events';
import { persistentStorage } from '../../../persistent-storage';

const DEFAULT_POS_X = 0;
const DEFAULT_POS_Y = 0;
const WHEEL_MOVE_FACTOR = 0.5;

export class HandToolSystem extends SceneSystem {
  private world: World;
  private mainActor: Actor;
  private rootNode: HTMLElement;

  private isCursorTracking: boolean;
  private anchor: Vector2;

  constructor(options: SceneSystemOptions) {
    super();

    const { world } = options;

    this.world = world;
    this.mainActor = world.data.mainActor as Actor;

    this.rootNode = document.getElementById(CANVAS_ROOT) as HTMLElement;

    this.isCursorTracking = false;
    this.anchor = new Vector2(0, 0);

    this.world.addEventListener(EventType.SelectScene, this.handleSceneChange);
    this.world.addEventListener(
      EventType.CameraMoveStart,
      this.handleCameraMoveStart,
    );
    this.world.addEventListener(
      EventType.CameraMoveEnd,
      this.handleCameraMoveEnd,
    );
    this.world.addEventListener(EventType.CameraMove, this.handleCameraMove);

    this.rootNode.addEventListener('wheel', this.handleWheel);
  }

  onSceneDestroy(): void {
    this.world.removeEventListener(
      EventType.SelectScene,
      this.handleSceneChange,
    );
    this.world.removeEventListener(
      EventType.CameraMoveStart,
      this.handleCameraMoveStart,
    );
    this.world.removeEventListener(
      EventType.CameraMoveEnd,
      this.handleCameraMoveEnd,
    );
    this.world.removeEventListener(EventType.CameraMove, this.handleCameraMove);

    this.rootNode.removeEventListener('wheel', this.handleWheel);
  }

  private handleSceneChange = (): void => {
    const transform = this.mainActor.getComponent(Transform);
    transform.world.position.x = DEFAULT_POS_X;
    transform.world.position.y = DEFAULT_POS_Y;

    this.saveCameraPosition(
      transform.world.position.x,
      transform.world.position.y,
    );
  };

  private handleCameraMoveStart = (event: MouseControlEvent): void => {
    const { screenX, screenY } = event;

    this.isCursorTracking = true;
    this.anchor.x = screenX;
    this.anchor.y = screenY;
  };

  private handleCameraMoveEnd = (): void => {
    this.isCursorTracking = false;
  };

  private handleCameraMove = (event: MouseControlEvent): void => {
    if (!this.isCursorTracking) {
      return;
    }

    const { screenX, screenY } = event;

    const transform = this.mainActor.getComponent(Transform);
    const { zoom } = this.mainActor.getComponent(Camera);

    transform.world.position.x += (this.anchor.x - screenX) / zoom;
    transform.world.position.y += (this.anchor.y - screenY) / zoom;

    this.anchor.x = screenX;
    this.anchor.y = screenY;

    this.saveCameraPosition(
      transform.world.position.x,
      transform.world.position.y,
    );
  };

  private handleWheel = (event: WheelEvent): void => {
    if (event.ctrlKey) {
      return;
    }

    const transform = this.mainActor.getComponent(Transform);
    const { zoom } = this.mainActor.getComponent(Camera);

    const deltaX = (event.deltaX * WHEEL_MOVE_FACTOR) / zoom;
    const deltaY = (event.deltaY * WHEEL_MOVE_FACTOR) / zoom;

    transform.world.position.x += deltaX;
    transform.world.position.y += deltaY;

    this.saveCameraPosition(
      transform.world.position.x,
      transform.world.position.y,
    );
  };

  private saveCameraPosition(x: number, y: number): void {
    persistentStorage.set('canvas.mainActor.transform.offsetX', x);
    persistentStorage.set('canvas.mainActor.transform.offsetY', y);
  }
}

HandToolSystem.systemName = 'HandToolSystem';
