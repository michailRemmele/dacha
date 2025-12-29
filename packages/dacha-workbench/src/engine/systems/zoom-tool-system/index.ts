import { SceneSystem, Camera, Transform } from 'dacha';
import type { World, SceneSystemOptions, Actor } from 'dacha';
import type { MouseControlEvent } from 'dacha/events';

import { CANVAS_ROOT } from '../../../consts/root-nodes';
import { EventType } from '../../../events';
import { getTool } from '../../../utils/get-tool';
import {
  getProjectedX,
  getProjectedY,
} from '../../../utils/coordinates-projection';
import { persistentStorage } from '../../../persistent-storage';

import { ZOOM_FACTOR, WHEEL_ZOOM_STEP, DEFAULT_ZOOM } from './consts';
import { updateZoom } from './utils';

type ZoomMode = 'in' | 'out';

export class ZoomToolSystem extends SceneSystem {
  private world: World;
  private mainActor: Actor;
  private rootNode: HTMLElement;

  constructor(options: SceneSystemOptions) {
    super();

    const { world } = options;

    this.world = world;
    this.mainActor = world.data.mainActor as Actor;

    this.rootNode = document.getElementById(CANVAS_ROOT) as HTMLElement;

    this.world.addEventListener(EventType.SelectScene, this.handleSelectScene);
    this.world.addEventListener(EventType.CameraZoom, this.handleCameraZoom);

    this.rootNode.addEventListener('wheel', this.handleWheel);
  }

  onSceneDestroy(): void {
    this.world.removeEventListener(
      EventType.SelectScene,
      this.handleSelectScene,
    );
    this.world.removeEventListener(EventType.CameraZoom, this.handleCameraZoom);

    this.rootNode.removeEventListener('wheel', this.handleWheel);
  }

  private handleSelectScene = (): void => {
    const cameraComponent = this.mainActor.getComponent(Camera);
    cameraComponent.zoom = DEFAULT_ZOOM;

    persistentStorage.set('canvas.mainActor.camera.zoom', cameraComponent.zoom);
  };

  private handleCameraZoom = (event: MouseControlEvent): void => {
    const tool = getTool(this.world);
    const zoomMode = tool.features.direction.value as ZoomMode;

    const cameraComponent = this.mainActor.getComponent(Camera);

    const zoomFactor = zoomMode === 'in' ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;

    cameraComponent.zoom = updateZoom(cameraComponent.zoom, zoomFactor);

    persistentStorage.set('canvas.mainActor.camera.zoom', cameraComponent.zoom);

    this.updateCameraPosition(event.x, event.y, event.screenX, event.screenY);
  };

  private handleWheel = (event: WheelEvent): void => {
    if (!event.ctrlKey) {
      return;
    }

    const x = getProjectedX(event.offsetX, this.mainActor);
    const y = getProjectedY(event.offsetY, this.mainActor);

    const cameraComponent = this.mainActor.getComponent(Camera);

    const zoomDirection = event.deltaY > 0 ? -1 : 1;

    const zoomFactor = 1 + zoomDirection * WHEEL_ZOOM_STEP;

    cameraComponent.zoom = updateZoom(cameraComponent.zoom, zoomFactor);

    persistentStorage.set('canvas.mainActor.camera.zoom', cameraComponent.zoom);

    this.updateCameraPosition(x, y, event.offsetX, event.offsetY);
  };

  private updateCameraPosition(
    x: number,
    y: number,
    screenX: number,
    screenY: number,
  ): void {
    const cameraComponent = this.mainActor.getComponent(Camera);
    const transform = this.mainActor.getComponent(Transform);

    const { windowSizeX, windowSizeY, zoom } = cameraComponent;

    const windowCenterX = windowSizeX / 2;
    const windowCenterY = windowSizeY / 2;

    const nextX = (screenX - windowCenterX) / zoom + transform.world.position.x;
    const nextY = (screenY - windowCenterY) / zoom + transform.world.position.y;

    // Move camera in direction of zoom
    transform.world.position.x += x - nextX;
    transform.world.position.y += y - nextY;

    persistentStorage.set(
      'canvas.mainActor.transform.offsetX',
      transform.world.position.x,
    );
    persistentStorage.set(
      'canvas.mainActor.transform.offsetY',
      transform.world.position.y,
    );
  }
}

ZoomToolSystem.systemName = 'ZoomToolSystem';
