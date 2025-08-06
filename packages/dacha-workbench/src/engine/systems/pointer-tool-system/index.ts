import {
  SceneSystem,
  RendererService,
  ActorCollection,
  Transform,
} from 'dacha'
import type {
  World,
  SceneSystemOptions,
  Actor,
  ActorSpawner,
} from 'dacha'
import type { MouseControlEvent } from 'dacha/events'

import { EventType } from '../../../events'
import type { SelectEntitiesEvent, SelectSceneEvent } from '../../../events'
import { getAncestor } from '../../../utils/get-ancestor'
import { getSavedSelectedSceneId } from '../../../utils/get-saved-selected-scene-id'
import { getSavedEntitySelection } from '../../../utils/get-saved-entity-selection'
import { getIdByPath } from '../../../utils/get-id-by-path'
import type { CommanderStore } from '../../../store'
import { Frame } from '../../components'

import { SelectionMovementSubsystem } from './selection-movement'
import {
  buildActorPath,
  updateFrameSize,
  updateAreaSize,
  getActorIdByPath,
} from './utils'
import type { SelectedActors, SelectionArea } from './types'

export class PointerToolSystem extends SceneSystem {
  private world: World
  private actorSpawner: ActorSpawner
  private actorCollection: ActorCollection
  private configStore: CommanderStore

  private mainActor: Actor

  private selectedActors: SelectedActors

  private selectionMovementSubsystem: SelectionMovementSubsystem

  private selectionArea?: SelectionArea

  constructor(options: SceneSystemOptions) {
    super()

    const {
      world,
      scene,
      actorSpawner,
    } = options

    this.world = world
    this.actorSpawner = actorSpawner
    this.actorCollection = new ActorCollection(scene, {
      components: [Transform],
    })
    this.configStore = world.data.configStore as CommanderStore
    this.mainActor = world.data.mainActor as Actor

    this.selectedActors = {
      actorPaths: getSavedEntitySelection(this.configStore),
      frames: [],
      sceneId: getSavedSelectedSceneId(this.configStore),
    }

    this.selectionArea = undefined

    this.world.addEventListener(EventType.SelectScene, this.handleSelectScene)
    this.world.addEventListener(EventType.SelectEntitiesChange, this.handleSelectEntities)
    this.world.addEventListener(EventType.SelectionMoveStart, this.handleSelectionMoveStart)
    this.world.addEventListener(EventType.SelectionMove, this.handleSelectionMove)
    this.world.addEventListener(EventType.SelectionMoveEnd, this.handleSelectionMoveEnd)

    this.selectionMovementSubsystem = new SelectionMovementSubsystem({
      world,
      selectedActors: this.selectedActors,
      actorCollection: this.actorCollection,
    })
  }

  onSceneEnter(): void {
    this.updateFrames()
  }

  onSceneDestroy(): void {
    this.world.removeEventListener(EventType.SelectScene, this.handleSelectScene)
    this.world.removeEventListener(EventType.SelectEntitiesChange, this.handleSelectEntities)
    this.world.removeEventListener(EventType.SelectionMoveStart, this.handleSelectionMoveStart)
    this.world.removeEventListener(EventType.SelectionMove, this.handleSelectionMove)
    this.world.removeEventListener(EventType.SelectionMoveEnd, this.handleSelectionMoveEnd)

    this.selectionMovementSubsystem.destroy()
  }

  private handleSelectScene = (event: SelectSceneEvent): void => {
    this.selectedActors.sceneId = event.sceneId
    this.updateFrames()
  }

  private handleSelectEntities = (event: SelectEntitiesEvent): void => {
    this.selectedActors.actorPaths = event.paths
    this.updateFrames()
  }

  private handleSelectionMoveStart = (event: MouseControlEvent): void => {
    const { actorPaths, sceneId } = this.selectedActors

    if (sceneId === undefined) {
      return
    }

    const { x, y, nativeEvent } = event
    const selectedActor = this.selectActor(x, y)

    const shiftPick = nativeEvent.shiftKey
    const isWithinSelection = selectedActor
      && actorPaths.some((path) => getActorIdByPath(path, sceneId) === selectedActor.id)

    if (isWithinSelection && shiftPick) {
      const newSelection = actorPaths
        .filter((path) => getActorIdByPath(path, sceneId) !== selectedActor.id)
      this.sendSelectionEvents(newSelection, newSelection.at(-1))
      return
    }

    if (selectedActor && !isWithinSelection && shiftPick) {
      const newSelection = [...actorPaths, buildActorPath(selectedActor, sceneId)]
      this.sendSelectionEvents(newSelection, newSelection.at(-1))
      return
    }

    if (selectedActor && !isWithinSelection && !shiftPick) {
      const path = buildActorPath(selectedActor, sceneId)
      this.sendSelectionEvents([path], path)
      return
    }

    if (!selectedActor && !shiftPick) {
      this.sendSelectionEvents([], undefined)
    }

    if (!selectedActor) {
      const areaActor = this.actorSpawner.spawn('selectionArea')
      this.mainActor.appendChild(areaActor)
      this.selectionArea = {
        sceneSize: {
          x0: x, y0: y, x1: x, y1: y,
        },
        area: areaActor,
      }
    }
  }

  private handleSelectionMove = (event: MouseControlEvent): void => {
    const { x, y } = event

    if (!this.selectionArea) {
      return
    }

    this.selectionArea.sceneSize.x1 = x
    this.selectionArea.sceneSize.y1 = y

    updateAreaSize(this.selectionArea)
  }

  private handleSelectionMoveEnd = (event: MouseControlEvent): void => {
    const { sceneId, actorPaths } = this.selectedActors
    const { x, y } = event

    if (!sceneId || !this.selectionArea) {
      return
    }

    const { sceneSize, area } = this.selectionArea

    sceneSize.x1 = x
    sceneSize.y1 = y

    const minX = Math.min(sceneSize.x0, sceneSize.x1)
    const maxX = Math.max(sceneSize.x0, sceneSize.x1)
    const minY = Math.min(sceneSize.y0, sceneSize.y1)
    const maxY = Math.max(sceneSize.y0, sceneSize.y1)

    const rendererService = this.world.getService(RendererService)
    const actors = rendererService.intersectsWithRectangle(minX, minY, maxX, maxY)

    const selectedActorIds = new Set(actorPaths.map((path) => getIdByPath(path)))
    const newSelection = actors.reduce((acc, actor) => {
      if (!selectedActorIds.has(actor.id)) {
        acc.push(buildActorPath(actor, sceneId))
      }
      return acc
    }, [...actorPaths])

    this.sendSelectionEvents(newSelection, newSelection.at(-1))
    area.remove()
    this.selectionArea = undefined
  }

  private sendSelectionEvents(selection: string[][], inspectedEntity: string[] | undefined): void {
    this.world.dispatchEvent(EventType.SelectEntities, {
      paths: selection,
    })
    this.world.dispatchEvent(EventType.InspectEntity, {
      path: inspectedEntity,
    })

    this.selectedActors.actorPaths = selection
    this.updateFrames()
  }

  private selectActor(x: number, y: number): Actor | undefined {
    const rendererService = this.world.getService(RendererService)
    return rendererService
      .intersectsWithPoint(x, y)
      .find((actor) => getAncestor(actor).id !== this.mainActor.id)
  }

  private updateFrames(): void {
    if (!this.selectedActors.sceneId) {
      return
    }

    this.selectedActors.frames.forEach((frame) => frame.remove())

    this.selectedActors.frames = this.selectedActors.actorPaths.reduce((acc: Actor[], path) => {
      const id = getActorIdByPath(path, this.selectedActors.sceneId)
      if (!id) {
        return acc
      }

      const frame = this.actorSpawner.spawn('frame')

      const frameComponent = frame.getComponent(Frame)
      frameComponent.selectedActorId = id

      this.mainActor.appendChild(frame)

      acc.push(frame)
      return acc
    }, [])
  }

  private updateFramesSize(): void {
    const rendererService = this.world.getService(RendererService)

    this.selectedActors.frames.forEach((frame) => {
      const { selectedActorId } = frame.getComponent(Frame)
      if (!selectedActorId) {
        return
      }

      const actor = this.actorCollection.getById(selectedActorId)
      if (!actor) {
        return
      }

      const bounds = rendererService.getBounds(actor)
      updateFrameSize(frame, bounds)
    })
  }

  update(): void {
    this.updateFramesSize()
  }
}

PointerToolSystem.systemName = 'PointerToolSystem'
