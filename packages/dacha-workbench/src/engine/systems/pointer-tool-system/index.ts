import { System, SpriteRendererService } from 'remiz'
import type {
  Scene,
  SystemOptions,
  GameObject,
  GameObjectSpawner,
  GameObjectDestroyer,
  GameObjectObserver,
  MouseControlEvent,
} from 'remiz'

import { getPointerToolObject } from '../../../utils/get-tool'
import { EventType } from '../../../events'
import type { InspectEntityEvent, SelectLevelEvent } from '../../../events'

import { SelectionMovementSubsystem } from './selection-movement'
import { buildGameObjectPath, updateFrameSize } from './utils'
import { LEVEL_PATH_LEGTH } from './consts'
import type { SelectedObject } from './types'

export class PointerToolSystem extends System {
  private scene: Scene
  private gameObjectSpawner: GameObjectSpawner
  private gameObjectDestroyer: GameObjectDestroyer
  private gameObjectObserver: GameObjectObserver

  private mainObject: GameObject
  private pointerToolObject: GameObject

  private selectedObject: SelectedObject

  private frame?: GameObject

  private selectionMovementSubsystem: SelectionMovementSubsystem

  constructor(options: SystemOptions) {
    super()

    const {
      scene,
      gameObjectSpawner,
      gameObjectDestroyer,
      createGameObjectObserver,
    } = options

    this.scene = scene
    this.gameObjectSpawner = gameObjectSpawner
    this.gameObjectDestroyer = gameObjectDestroyer
    this.gameObjectObserver = createGameObjectObserver({})

    this.mainObject = scene.context.data.mainObject as GameObject
    this.pointerToolObject = getPointerToolObject(scene.context)

    this.selectedObject = {}

    this.selectionMovementSubsystem = new SelectionMovementSubsystem({
      scene,
      gameObjectObserver: this.gameObjectObserver,
      selectedObject: this.selectedObject,
    })
  }

  mount(): void {
    this.scene.addEventListener(EventType.SelectLevel, this.handleSelectLevel)
    this.scene.addEventListener(EventType.InspectedEntityChange, this.handleInspectEntity)
    this.pointerToolObject.addEventListener(
      EventType.SelectionMoveStart,
      this.handleSelectionMoveStart,
    )

    this.selectionMovementSubsystem.mount()
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SelectLevel, this.handleSelectLevel)
    this.scene.removeEventListener(EventType.InspectedEntityChange, this.handleInspectEntity)
    this.pointerToolObject.removeEventListener(
      EventType.SelectionMoveStart,
      this.handleSelectionMoveStart,
    )

    this.selectionMovementSubsystem.unmount()
  }

  private handleSelectLevel = (event: SelectLevelEvent): void => {
    const { levelId } = event
    this.selectedObject.levelId = levelId
  }

  private handleInspectEntity = (event: InspectEntityEvent): void => {
    const { path } = event

    if (path !== undefined && path[0] === 'levels' && path.length > LEVEL_PATH_LEGTH) {
      this.selectedObject.objectId = path.at(-1)?.split(':').at(-1)
    } else {
      this.selectedObject.objectId = undefined
    }
  }

  private handleSelectionMoveStart = (event: MouseControlEvent): void => {
    if (this.selectedObject.levelId === undefined) {
      return
    }

    const { screenX, screenY } = event

    const rendererService = this.scene.context.getService(SpriteRendererService)

    const selectedObject = rendererService
      .intersectsWithPoint(screenX, screenY)
      .find((gameObject) => gameObject.getAncestor().id !== this.mainObject.id)

    this.scene.emit(EventType.InspectEntity, {
      path: selectedObject !== undefined
        ? buildGameObjectPath(selectedObject, this.selectedObject.levelId)
        : undefined,
    })

    this.selectedObject.objectId = selectedObject?.id
  }

  private deleteFrame(): void {
    if (this.frame === undefined) {
      return
    }

    this.gameObjectDestroyer.destroy(this.frame)
    this.frame = undefined
  }

  private updateFrame(): void {
    if (this.frame === undefined && this.selectedObject.objectId !== undefined) {
      this.frame = this.gameObjectSpawner.spawn('frame')
      this.mainObject.appendChild(this.frame)
    }

    if (this.selectedObject.objectId === undefined) {
      this.deleteFrame()
      return
    }

    if (this.frame === undefined || this.selectedObject.objectId === undefined) {
      return
    }

    const selectedObject = this.gameObjectObserver.getById(this.selectedObject.objectId)
    if (selectedObject === undefined) {
      return
    }

    updateFrameSize(this.frame, selectedObject)
  }

  update(): void {
    this.updateFrame()
  }
}

PointerToolSystem.systemName = 'PointerToolSystem'
