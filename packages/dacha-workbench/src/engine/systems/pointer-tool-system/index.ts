import {
  System,
  SpriteRendererService,
} from 'remiz'
import type {
  Scene,
  SystemOptions,
  Actor,
  ActorSpawner,
  MouseControlEvent,
} from 'remiz'

import { EventType } from '../../../events'
import type { InspectEntityEvent, SelectLevelEvent } from '../../../events'
import { getAncestor } from '../../../utils/get-ancestor'

import { SelectionMovementSubsystem } from './selection-movement'
import { buildActorPath, updateFrameSize } from './utils'
import { LEVEL_PATH_LEGTH } from './consts'
import type { SelectedActor } from './types'

export class PointerToolSystem extends System {
  private scene: Scene
  private actorSpawner: ActorSpawner

  private mainActor: Actor

  private selectedActor: SelectedActor

  private frame?: Actor

  private selectionMovementSubsystem: SelectionMovementSubsystem

  constructor(options: SystemOptions) {
    super()

    const {
      scene,
      actorSpawner,
    } = options

    this.scene = scene
    this.actorSpawner = actorSpawner

    this.mainActor = scene.data.mainActor as Actor

    this.selectedActor = {}

    this.selectionMovementSubsystem = new SelectionMovementSubsystem({
      scene,
      selectedActor: this.selectedActor,
    })
  }

  mount(): void {
    this.scene.addEventListener(EventType.SelectLevel, this.handleSelectLevel)
    this.scene.addEventListener(EventType.InspectedEntityChange, this.handleInspectEntity)
    this.scene.addEventListener(EventType.SelectionMoveStart, this.handleSelectionMoveStart)

    this.selectionMovementSubsystem.mount()
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SelectLevel, this.handleSelectLevel)
    this.scene.removeEventListener(EventType.InspectedEntityChange, this.handleInspectEntity)
    this.scene.removeEventListener(EventType.SelectionMoveStart, this.handleSelectionMoveStart)

    this.selectionMovementSubsystem.unmount()
  }

  private handleSelectLevel = (event: SelectLevelEvent): void => {
    const { levelId } = event
    this.selectedActor.levelId = levelId
  }

  private handleInspectEntity = (event: InspectEntityEvent): void => {
    const { path } = event

    if (path !== undefined && path[0] === 'levels' && path.length > LEVEL_PATH_LEGTH) {
      this.selectedActor.actorId = path.at(-1)?.split(':').at(-1)
    } else {
      this.selectedActor.actorId = undefined
    }
  }

  private handleSelectionMoveStart = (event: MouseControlEvent): void => {
    if (this.selectedActor.levelId === undefined) {
      return
    }

    const { screenX, screenY } = event

    const rendererService = this.scene.getService(SpriteRendererService)

    const selectedActor = rendererService
      .intersectsWithPoint(screenX, screenY)
      .find((actor) => getAncestor(actor).id !== this.mainActor.id)

    this.scene.emit(EventType.InspectEntity, {
      path: selectedActor !== undefined
        ? buildActorPath(selectedActor, this.selectedActor.levelId)
        : undefined,
    })

    this.selectedActor.actorId = selectedActor?.id
  }

  private deleteFrame(): void {
    if (this.frame === undefined) {
      return
    }

    this.frame.remove()
    this.frame = undefined
  }

  private updateFrame(): void {
    if (this.frame === undefined && this.selectedActor.actorId !== undefined) {
      this.frame = this.actorSpawner.spawn('frame')
      this.mainActor.appendChild(this.frame)
    }

    if (this.selectedActor.actorId === undefined) {
      this.deleteFrame()
      return
    }

    if (this.frame === undefined || this.selectedActor.actorId === undefined) {
      return
    }

    const selectedActor = this.scene.getEntityById(this.selectedActor.actorId)
    if (selectedActor === undefined) {
      return
    }

    updateFrameSize(this.frame, selectedActor)
  }

  update(): void {
    this.updateFrame()
  }
}

PointerToolSystem.systemName = 'PointerToolSystem'
