import {
  RendererService,
  Transform,
} from 'dacha'
import type {
  World,
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

import { isFloatEqual, updateActorTransform } from './utils'

export interface Position {
  x: number
  y: number
}

interface SelectionMovementSubsystemOptions {
  world: World
  selectedActors: SelectedActors
  actorCollection: ActorCollection
}

export class SelectionMovementSubsystem {
  private world: World
  private actorCollection: ActorCollection
  private configStore: CommanderStore

  private isMoving: boolean
  private selectionStart: Record<string, Position | undefined>
  private pointerStart: Position

  private selectedActors: SelectedActors

  constructor({
    world,
    selectedActors,
    actorCollection,
  }: SelectionMovementSubsystemOptions) {
    this.world = world
    this.actorCollection = actorCollection
    this.configStore = world.data.configStore as CommanderStore
    this.selectedActors = selectedActors

    this.isMoving = false
    this.selectionStart = {}
    this.pointerStart = { x: 0, y: 0 }

    this.world.addEventListener(EventType.SelectionMoveStart, this.handleSelectionMoveStart)
    this.world.addEventListener(EventType.SelectionMoveEnd, this.handleSelectionMoveEnd)
    this.world.addEventListener(EventType.SelectionMove, this.handleSelectionMove)
  }

  destroy(): void {
    this.world.removeEventListener(EventType.SelectionMoveStart, this.handleSelectionMoveStart)
    this.world.removeEventListener(EventType.SelectionMoveEnd, this.handleSelectionMoveEnd)
    this.world.removeEventListener(EventType.SelectionMove, this.handleSelectionMove)
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
        x: transform.world.position.x,
        y: transform.world.position.y,
      }
    })
  }

  private handleSelectionMoveEnd = (): void => {
    if (
      !this.isMoving
      || this.selectedActors.frames.length === 0
      || this.selectedActors.sceneId === undefined
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
        isFloatEqual(transform.world.position.x, selectionStart.x)
        && isFloatEqual(transform.world.position.y, selectionStart.y)
      ) {
        return
      }

      newTransformMap.set(actor.id, {
        offsetX: transform.local.position.x,
        offsetY: transform.local.position.y,
      })
    })

    this.isMoving = false
    this.selectionStart = {}

    if (newTransformMap.size === 0) {
      return
    }

    const actorsPath = ['scenes', `id:${this.selectedActors.sceneId}`, 'actors']
    const actorConfigs = this.configStore.get(actorsPath) as ActorConfig[]

    const updatedActors = actorConfigs.map(
      (actorConfig) => updateActorTransform(actorConfig, newTransformMap),
    )

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

    const tool = getTool(this.world)
    const snapToGrid = tool.features.grid.value as boolean

    const rendererService = this.world.getService(RendererService)

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
        const gridStep = getGridStep(this.world)

        const bounds = rendererService.getBounds(actor)

        transform.world.position.x = getGridValue(offsetX, bounds.width, gridStep)
        transform.world.position.y = getGridValue(offsetY, bounds.height, gridStep)
      } else {
        transform.world.position.x = Math.round(offsetX)
        transform.world.position.y = Math.round(offsetY)
      }
    })
  }
}
