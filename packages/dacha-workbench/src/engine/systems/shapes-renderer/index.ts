import {
  SceneSystem,
  Transform,
  CameraService,
  ActorQuery,
} from 'dacha'
import type { SceneSystemOptions } from 'dacha'

import { Shape } from '../../components'

import { CoordinatesTransformer } from './coordinates-transformer'
import { painters } from './shape-painters'

interface ShapesRendererOptions extends SceneSystemOptions {
  windowNodeId: string
}

export class ShapesRenderer extends SceneSystem {
  private actorQuery: ActorQuery
  private cameraService: CameraService
  private window: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private canvasWidth: number
  private canvasHeight: number

  private transformer: CoordinatesTransformer

  constructor(options: SceneSystemOptions) {
    super()

    const {
      world,
      scene,
      windowNodeId,
    } = options as ShapesRendererOptions

    this.actorQuery = new ActorQuery({
      scene,
      filter: [
        Transform,
        Shape,
      ],
    })

    const windowNode = document.getElementById(windowNodeId)

    if (!windowNode) {
      throw new Error('Unable to load ShapesRenderer. Root canvas node not found')
    }
    if (!(windowNode instanceof HTMLCanvasElement)) {
      throw new Error('Unable to load ShapesRenderer. Root canvas node should be an instance of HTMLCanvasElement')
    }

    this.window = windowNode

    this.context = this.window.getContext('2d') as CanvasRenderingContext2D
    this.canvasWidth = this.window.clientWidth
    this.canvasHeight = this.window.clientHeight

    this.cameraService = world.getService(CameraService)

    this.transformer = new CoordinatesTransformer()
    this.transformer.setDevicePixelRatio(window.devicePixelRatio || 1)

    window.addEventListener('resize', this.handleWindowResize)
  }

  onSceneEnter(): void {
    this.handleWindowResize()
  }

  onSceneDestroy(): void {
    window.removeEventListener('resize', this.handleWindowResize)
  }

  private handleWindowResize = (): void => {
    this.transformer.setViewport(this.window.clientWidth, this.window.clientHeight)

    this.canvasWidth = this.transformer.getViewportWidth()
    this.canvasHeight = this.transformer.getViewportHeight()

    this.window.width = this.transformer.getViewportWidth()
    this.window.height = this.transformer.getViewportHeight()
  }

  update(): void {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

    const currentCamera = this.cameraService.getCurrentCamera()

    this.transformer.setCamera(currentCamera)

    this.actorQuery.getActors().forEach((actor) => {
      const transform = actor.getComponent(Transform)
      const shape = actor.getComponent(Shape)

      const paintShape = painters[shape.type]
      paintShape(this.context, this.transformer, shape.properties, transform)
    })
  }
}

ShapesRenderer.systemName = 'ShapesRenderer'
