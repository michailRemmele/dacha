import {
  Transform,
  Sprite,
} from 'remiz'
import type {
  Scene,
  GameObject,
  MouseControlEvent,
} from 'remiz'

import { EventType } from '../../../../events'
import { SET } from '../../../../command-types'
import { ROOT_SCOPE } from '../../../../consts/command-scopes'
import { buildGameObjectPath } from '../utils'
import { getTool, getPointerToolObject } from '../../../../utils/get-tool'
import { getGridValue, getGridStep } from '../../../../utils/grid'
import type { Store } from '../../../../store'
import type { SelectedObject } from '../types'

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
  selectedObject: SelectedObject
}

export class SelectionMovementSubsystem {
  private scene: Scene
  private configStore: Store

  private pointerToolObject: GameObject
  private isMoving: boolean
  private selectionStart: Position
  private pointerStart: Position

  private selectedObject: SelectedObject

  constructor({
    scene,
    selectedObject,
  }: SelectionMovementSubsystemOptions) {
    this.scene = scene
    this.pointerToolObject = getPointerToolObject(scene)
    this.configStore = scene.data.configStore as Store
    this.selectedObject = selectedObject

    this.isMoving = false
    this.selectionStart = { x: 0, y: 0 }
    this.pointerStart = { x: 0, y: 0 }
  }

  mount(): void {
    this.pointerToolObject.addEventListener(
      EventType.SelectionMoveStart,
      this.handleSelectionMoveStart,
    )
    this.pointerToolObject.addEventListener(
      EventType.SelectionMoveEnd,
      this.handleSelectionMoveEnd,
    )
    this.pointerToolObject.addEventListener(
      EventType.SelectionMove,
      this.handleSelectionMove,
    )
  }

  unmount(): void {
    this.pointerToolObject.removeEventListener(
      EventType.SelectionMoveStart,
      this.handleSelectionMoveStart,
    )
    this.pointerToolObject.removeEventListener(
      EventType.SelectionMoveEnd,
      this.handleSelectionMoveEnd,
    )
    this.pointerToolObject.removeEventListener(
      EventType.SelectionMove,
      this.handleSelectionMove,
    )
  }

  private handleSelectionMoveStart = (event: MouseControlEvent): void => {
    if (this.selectedObject.objectId === undefined) {
      return
    }

    const { x, y } = event

    const selectedObject = this.scene.getGameObject(this.selectedObject.objectId)
    if (selectedObject === undefined) {
      return
    }

    const transform = selectedObject.getComponent(Transform)
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
      || this.selectedObject.objectId === undefined
      || this.selectedObject.levelId === undefined
    ) {
      return
    }

    this.isMoving = false

    const selectedObject = this.scene.getGameObject(this.selectedObject.objectId)
    if (selectedObject === undefined) {
      return
    }

    const objectPath = buildGameObjectPath(selectedObject, this.selectedObject.levelId)
    const transformPath = objectPath.concat('components', `name:${Transform.componentName}`, 'config')

    const transform = selectedObject.getComponent(Transform)
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

    this.scene.emit(EventType.Command, {
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
    if (!this.isMoving || this.selectedObject.objectId === undefined) {
      return
    }

    const { x, y } = event

    const selectedObject = this.scene.getGameObject(this.selectedObject.objectId)
    if (selectedObject === undefined) {
      return
    }

    const transform = selectedObject.getComponent(Transform)
    if (transform === undefined) {
      return
    }

    const tool = getTool(this.scene)
    const snapToGrid = tool.features.grid.value as boolean

    const offsetX = this.selectionStart.x - this.pointerStart.x + x
    const offsetY = this.selectionStart.y - this.pointerStart.y + y

    if (snapToGrid) {
      const sprite = selectedObject.getComponent(Sprite)

      const gridStep = getGridStep(this.scene)

      transform.offsetX = getGridValue(offsetX, getSizeX(transform, sprite), gridStep)
      transform.offsetY = getGridValue(offsetY, getSizeY(transform, sprite), gridStep)
    } else {
      transform.offsetX = Math.round(offsetX)
      transform.offsetY = Math.round(offsetY)
    }
  }
}
