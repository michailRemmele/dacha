import {
  Transform,
  Sprite,
} from 'dacha'
import type { Scene } from 'dacha'
import type { MouseControlEvent } from 'dacha/events'

import { EventType } from '../../../../events'
import { SET } from '../../../../command-types'
import { ROOT_SCOPE } from '../../../../consts/command-scopes'
import { buildActorPath } from '../utils'
import { getTool } from '../../../../utils/get-tool'
import { getGridValue, getGridStep } from '../../../../utils/grid'
import type { CommanderStore } from '../../../../store'
import type { SelectedActor } from '../types'

import {
  isFloatEqual,
  getSizeX,
  getSizeY,
} from './utils'

export interface Position {
  x: number
  y: number
}

interface SelectionMovementSubsystemOptions {
  scene: Scene
  selectedActor: SelectedActor
}

export class SelectionMovementSubsystem {
  private scene: Scene
  private configStore: CommanderStore

  private isMoving: boolean
  private selectionStart: Position
  private pointerStart: Position

  private selectedActor: SelectedActor

  constructor({
    scene,
    selectedActor,
  }: SelectionMovementSubsystemOptions) {
    this.scene = scene
    this.configStore = scene.data.configStore as CommanderStore
    this.selectedActor = selectedActor

    this.isMoving = false
    this.selectionStart = { x: 0, y: 0 }
    this.pointerStart = { x: 0, y: 0 }
  }

  mount(): void {
    this.scene.addEventListener(EventType.SelectionMoveStart, this.handleSelectionMoveStart)
    this.scene.addEventListener(EventType.SelectionMoveEnd, this.handleSelectionMoveEnd)
    this.scene.addEventListener(EventType.SelectionMove, this.handleSelectionMove)
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SelectionMoveStart, this.handleSelectionMoveStart)
    this.scene.removeEventListener(EventType.SelectionMoveEnd, this.handleSelectionMoveEnd)
    this.scene.removeEventListener(EventType.SelectionMove, this.handleSelectionMove)
  }

  private handleSelectionMoveStart = (event: MouseControlEvent): void => {
    if (this.selectedActor.actorId === undefined) {
      return
    }

    const { x, y } = event

    const selectedActor = this.scene.getEntityById(this.selectedActor.actorId)
    if (selectedActor === undefined) {
      return
    }

    const transform = selectedActor.getComponent(Transform)
    if (transform === undefined) {
      return
    }

    this.isMoving = true

    this.pointerStart.x = x
    this.pointerStart.y = y

    this.selectionStart.x = transform.offsetX
    this.selectionStart.y = transform.offsetY
  }

  private handleSelectionMoveEnd = (): void => {
    if (
      !this.isMoving
      || this.selectedActor.actorId === undefined
      || this.selectedActor.levelId === undefined
    ) {
      return
    }

    this.isMoving = false

    const selectedActor = this.scene.getEntityById(this.selectedActor.actorId)
    if (selectedActor === undefined) {
      return
    }

    const actorPath = buildActorPath(selectedActor, this.selectedActor.levelId)
    const transformPath = actorPath.concat('components', `name:${Transform.componentName}`, 'config')

    const transform = selectedActor.getComponent(Transform)
    if (transform === undefined) {
      return
    }

    const transformConfig = this.configStore.get(transformPath) as Record<string, unknown>

    if (
      isFloatEqual(transform.offsetX, this.selectionStart.x)
      && isFloatEqual(transform.offsetY, this.selectionStart.y)
    ) {
      return
    }

    this.configStore.dispatch({
      command: SET,
      scope: ROOT_SCOPE,
      options: {
        path: transformPath,
        value: {
          ...transformConfig,
          offsetX: transform.relativeOffsetX,
          offsetY: transform.relativeOffsetY,
        },
      },
    })
  }

  private handleSelectionMove = (event: MouseControlEvent): void => {
    if (!this.isMoving || this.selectedActor.actorId === undefined) {
      return
    }

    const { x, y } = event

    const selectedActor = this.scene.getEntityById(this.selectedActor.actorId)
    if (selectedActor === undefined) {
      return
    }

    const transform = selectedActor.getComponent(Transform)
    if (transform === undefined) {
      return
    }

    const tool = getTool(this.scene)
    const snapToGrid = tool.features.grid.value as boolean

    const offsetX = this.selectionStart.x - this.pointerStart.x + x
    const offsetY = this.selectionStart.y - this.pointerStart.y + y

    if (snapToGrid) {
      const sprite = selectedActor.getComponent(Sprite)

      const gridStep = getGridStep(this.scene)

      transform.offsetX = getGridValue(offsetX, getSizeX(transform, sprite), gridStep)
      transform.offsetY = getGridValue(offsetY, getSizeY(transform, sprite), gridStep)
    } else {
      transform.offsetX = Math.round(offsetX)
      transform.offsetY = Math.round(offsetY)
    }
  }
}
