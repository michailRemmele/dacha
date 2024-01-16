import { System, MouseControl } from 'remiz'
import type {
  Scene,
  SystemOptions,
  GameObject,
} from 'remiz'

import { EventType } from '../../../events'
import type { SelectToolEvent, SetToolFeatureValueEvent } from '../../../events'
import { HAND_TOOL } from '../../../consts/tools'
import { CANVAS_ROOT } from '../../../consts/root-nodes'
import { Tool, ToolController } from '../../components'
import type { FeatureValue } from '../../components/tool'

const DEFAULT_TOOL_NAME = HAND_TOOL
const TOOL_CLASS_NAME_PREFIX = `${CANVAS_ROOT}_tool_`
const FEATURE_CLASS_NAME_PREFIX = `${CANVAS_ROOT}_feature-`

const getFeatureClassName = (
  name: string,
  value: FeatureValue,
): string => `${FEATURE_CLASS_NAME_PREFIX}${name}_${String(value)}`

export class ToolManager extends System {
  private scene: Scene
  private mainObject: GameObject
  private rootNode: HTMLElement

  constructor(options: SystemOptions) {
    super()

    const { scene } = options

    this.scene = scene
    this.mainObject = this.scene.context.data.mainObject as GameObject

    this.rootNode = document.getElementById(CANVAS_ROOT) as HTMLElement
  }

  mount(): void {
    this.scene.addEventListener(EventType.SelectTool, this.handleSelectTool)
    this.scene.addEventListener(EventType.SetToolFeatureValue, this.handleSetToolFeatureValue)

    this.selectTool(DEFAULT_TOOL_NAME)
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SelectTool, this.handleSelectTool)
    this.scene.removeEventListener(EventType.SetToolFeatureValue, this.handleSetToolFeatureValue)
  }

  private selectTool(id: string): void {
    const toolController = this.mainObject.getComponent(ToolController)
    toolController.activeTool = id

    const toolObject = this.mainObject.getChildById(id)

    if (toolObject === undefined) {
      console.error(`Not found tool with same id: ${id}`)
      return
    }

    const { features, inputBindings } = toolObject.getComponent(Tool)

    const mouseControl = new MouseControl({
      inputEventBindings: inputBindings,
    })
    toolObject.setComponent(mouseControl)

    this.rootNode.classList.toggle(`${TOOL_CLASS_NAME_PREFIX}${id}`)

    Object.keys(features).forEach((key) => {
      const { value, withClassName } = features[key]
      if (withClassName) {
        this.rootNode.classList.toggle(getFeatureClassName(key, value))
      }
    })
  }

  private removeCurrentTool(): void {
    const toolController = this.mainObject.getComponent(ToolController)
    const toolObject = this.mainObject.getChildById(toolController.activeTool)

    if (toolObject) {
      const { name, features } = toolObject.getComponent(Tool)

      toolObject.removeComponent(MouseControl)
      this.rootNode.classList.toggle(`${TOOL_CLASS_NAME_PREFIX}${name}`)

      Object.keys(features).forEach((key) => {
        const { value, withClassName } = features[key]
        if (withClassName) {
          this.rootNode.classList.toggle(getFeatureClassName(key, value))
        }
      })
    }
  }

  private setToolFeatureValue(name: string, value: FeatureValue): void {
    const toolController = this.mainObject.getComponent(ToolController)
    const toolObject = this.mainObject.getChildById(toolController.activeTool)

    if (toolObject) {
      const { features } = toolObject.getComponent(Tool)
      const feature = features[name]

      if (feature.withClassName) {
        this.rootNode.classList.toggle(getFeatureClassName(name, feature.value))
        this.rootNode.classList.toggle(getFeatureClassName(name, value))
      }

      feature.value = value
    }
  }

  private handleSelectTool = (event: SelectToolEvent): void => {
    const { name } = event

    this.removeCurrentTool()
    this.selectTool(name)
  }

  private handleSetToolFeatureValue = (event: SetToolFeatureValueEvent): void => {
    const { name, value } = event

    this.setToolFeatureValue(name, value)
  }
}

ToolManager.systemName = 'ToolManager'
