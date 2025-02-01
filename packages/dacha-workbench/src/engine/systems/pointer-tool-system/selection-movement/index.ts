import {
  Transform,
  Sprite,
} from 'dacha'
import type {
  Scene,
  ActorConfig,
  TransformConfig,
  ActorCollection,
} from 'dacha'
import type { MouseControlEvent } from 'dacha/events'

import { Frame } from '../../../components'
import { EventType } from '../../../../events'
import { SET } from '../../../../command-types'
import { ROOT_SCOPE } from '../../../../consts/scopes'
import { getTool } from '../../../../utils/get-tool'
import { getGridValue, getGridStep } from '../../../../utils/grid'
import type { CommanderStore } from '../../../../store'
import type { SelectedActors } from '../types'

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
  selectedActors: SelectedActors
  actorCollection: ActorCollection
}

export class SelectionMovementSubsystem {
  private scene: Scene
  private actorCollection: ActorCollection
  private configStore: CommanderStore

  private isMoving: boolean
  private selectionStart: Record<string, Position | undefined>
  private pointerStart: Position

  private selectedActors: SelectedActors

  constructor({
    scene,
    selectedActors,
    actorCollection,
  }: SelectionMovementSubsystemOptions) {
    this.scene = scene
    this.actorCollection = actorCollection
    this.configStore = scene.data.configStore as CommanderStore
    this.selectedActors = selectedActors

    this.isMoving = false
    this.selectionStart = {}
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
    const { x, y, nativeEvent } = event
    const shiftPick = nativeEvent.shiftKey

    if (!this.selectedActors.frames.length || shiftPick) {
      return
    }

    this.isMoving = true

    this.pointerStart.x = x
    this.pointerStart.y = y

    this.selectedActors.frames.forEach((frame) => {
      const { selectedActorId } = frame.getComponent(Frame)
      const actor = selectedActorId ? this.actorCollection.getById(selectedActorId) : undefined

      if (actor === undefined) {
        return
      }

      const transform = actor.getComponent(Transform)
      if (transform === undefined) {
        return
      }

      this.selectionStart[actor.id] = {
        x: transform.offsetX,
        y: transform.offsetY,
      }
    })
  }

  private handleSelectionMoveEnd = (): void => {
    if (
      !this.isMoving
      || this.selectedActors.frames.length === 0
      || this.selectedActors.levelId === undefined
    ) {
      return
    }

    const newTransformMap = new Map<string, Partial<TransformConfig>>()

    this.selectedActors.frames.forEach((frame) => {
      const { selectedActorId } = frame.getComponent(Frame)
      const actor = selectedActorId ? this.actorCollection.getById(selectedActorId) : undefined
      const selectionStart = actor ? this.selectionStart[actor.id] : undefined

      if (actor === undefined || selectionStart === undefined) {
        return
      }

      const transform = actor.getComponent(Transform)
      if (transform === undefined) {
        return
      }

      if (
        isFloatEqual(transform.offsetX, selectionStart.x)
        && isFloatEqual(transform.offsetY, selectionStart.y)
      ) {
        return
      }

      newTransformMap.set(actor.id, {
        offsetX: transform.relativeOffsetX,
        offsetY: transform.relativeOffsetY,
      })
    })

    this.isMoving = false
    this.selectionStart = {}

    if (newTransformMap.size === 0) {
      return
    }

    const actorsPath = ['levels', `id:${this.selectedActors.levelId}`, 'actors']
    const actorConfigs = this.configStore.get(actorsPath) as ActorConfig[]

    const updatedActors = actorConfigs.map((actorConfig) => {
      if (!newTransformMap.has(actorConfig.id)) {
        return actorConfig
      }

      return {
        ...actorConfig,
        components: actorConfig.components?.map((component) => {
          if (component.name !== Transform.componentName) {
            return component
          }
          return {
            ...component,
            config: {
              ...component.config,
              ...newTransformMap.get(actorConfig.id),
            },
          }
        }),
      }
    })

    this.configStore.dispatch({
      command: SET,
      scope: ROOT_SCOPE,
      options: {
        path: actorsPath,
        value: updatedActors,
      },
    })
  }

  private handleSelectionMove = (event: MouseControlEvent): void => {
    if (!this.isMoving || this.selectedActors.frames.length === 0) {
      return
    }

    const { x, y } = event

    const tool = getTool(this.scene)
    const snapToGrid = tool.features.grid.value as boolean

    this.selectedActors.frames.forEach((frame) => {
      const { selectedActorId } = frame.getComponent(Frame)
      const actor = selectedActorId ? this.actorCollection.getById(selectedActorId) : undefined
      const selectionStart = actor ? this.selectionStart[actor.id] : undefined

      if (actor === undefined || selectionStart === undefined) {
        return
      }

      const transform = actor.getComponent(Transform)
      if (transform === undefined) {
        return
      }

      const offsetX = selectionStart.x - this.pointerStart.x + x
      const offsetY = selectionStart.y - this.pointerStart.y + y

      if (snapToGrid) {
        const sprite = actor.getComponent(Sprite)
        const gridStep = getGridStep(this.scene)

        transform.offsetX = getGridValue(offsetX, getSizeX(transform, sprite), gridStep)
        transform.offsetY = getGridValue(offsetY, getSizeY(transform, sprite), gridStep)
      } else {
        transform.offsetX = Math.round(offsetX)
        transform.offsetY = Math.round(offsetY)
      }
    })
  }
}
