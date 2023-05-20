import type {
  System,
  SystemOptions,
  GameObject,
  GameObjectSpawner,
  GameObjectDestroyer,
  MessageBus,
  Message,
  SceneContext,
} from 'remiz'

import { SELECT_TOOL_MSG, SET_TOOL_FEATURE_VALUE_MSG } from '../../../consts/message-types'
import { CANVAS_ROOT } from '../../../consts/root-nodes'
import { Tool } from '../../components'
import type { FeatureValue } from '../../components/tool'
import type { SelectToolMessage } from '../../../types/messages'

const TOOL_COMPONENT_NAME = 'tool'
const DEFAULT_TOOL_NAME = 'hand'
const TOOL_CLASS_NAME_PREFIX = `${CANVAS_ROOT}_tool_`
const FEATURE_CLASS_NAME_PREFIX = `${CANVAS_ROOT}_feature-`

interface SetToolFeatureValueMessage extends Message {
  name: string
  value: string
}

const getFeatureClassName = (
  name: string,
  value: FeatureValue,
): string => `${FEATURE_CLASS_NAME_PREFIX}${name}_${String(value)}`

export class ToolManager implements System {
  private gameObjectSpawner: GameObjectSpawner
  private gameObjectDestroyer: GameObjectDestroyer
  private messageBus: MessageBus
  private sceneContext: SceneContext
  private mainObject: GameObject
  private rootNode: HTMLElement

  constructor(options: SystemOptions) {
    const {
      gameObjectSpawner,
      gameObjectDestroyer,
      messageBus,
      sceneContext,
    } = options

    this.gameObjectSpawner = gameObjectSpawner
    this.gameObjectDestroyer = gameObjectDestroyer
    this.messageBus = messageBus
    this.sceneContext = sceneContext

    this.mainObject = this.sceneContext.data.mainObject as GameObject

    this.rootNode = document.getElementById(CANVAS_ROOT) as HTMLElement
  }

  mount(): void {
    this.selectTool(DEFAULT_TOOL_NAME)
  }

  private selectTool(name: string): void {
    const toolObject = this.gameObjectSpawner.spawn(name)
    const { features } = toolObject.getComponent(TOOL_COMPONENT_NAME) as Tool

    this.mainObject.appendChild(toolObject)

    this.sceneContext.data.currentToolObjectId = toolObject.id

    this.rootNode.classList.toggle(`${TOOL_CLASS_NAME_PREFIX}${name}`)

    Object.keys(features).forEach((key) => {
      const { value, withClassName } = features[key]
      if (withClassName) {
        this.rootNode.classList.toggle(getFeatureClassName(key, value))
      }
    })
  }

  private removeCurrentTool(): void {
    const toolObject = this.mainObject.getChildById(
      this.sceneContext.data.currentToolObjectId as string,
    )

    if (toolObject) {
      const { name, features } = toolObject.getComponent(TOOL_COMPONENT_NAME) as Tool

      this.gameObjectDestroyer.destroy(toolObject)
      this.rootNode.classList.toggle(`${TOOL_CLASS_NAME_PREFIX}${name}`)

      Object.keys(features).forEach((key) => {
        const { value, withClassName } = features[key]
        if (withClassName) {
          this.rootNode.classList.toggle(getFeatureClassName(key, value))
        }
      })
    }
  }

  private setToolFeatureValue(name: string, value: string): void {
    const toolObject = this.mainObject.getChildById(
      this.sceneContext.data.currentToolObjectId as string,
    )

    if (toolObject) {
      const { features } = toolObject.getComponent(TOOL_COMPONENT_NAME) as Tool
      const feature = features[name]

      if (feature.withClassName) {
        this.rootNode.classList.toggle(getFeatureClassName(name, feature.value))
        this.rootNode.classList.toggle(getFeatureClassName(name, value))
      }

      feature.value = value
    }
  }

  private handleSelectToolMessages(): void {
    const selectToolMessages = (
      this.messageBus.get(SELECT_TOOL_MSG) || []
    ) as Array<SelectToolMessage>

    if (!selectToolMessages.length) {
      return
    }

    const { name } = selectToolMessages[selectToolMessages.length - 1]

    this.removeCurrentTool()
    this.selectTool(name)
  }

  private handleSetToolFeatureValue(): void {
    const setToolFeatureValueMessages = (
      this.messageBus.get(SET_TOOL_FEATURE_VALUE_MSG) || []
    ) as Array<SetToolFeatureValueMessage>

    if (!setToolFeatureValueMessages.length) {
      return
    }

    const { name, value } = setToolFeatureValueMessages[setToolFeatureValueMessages.length - 1]

    this.setToolFeatureValue(name, value)
  }

  update(): void {
    this.handleSelectToolMessages()
    this.handleSetToolFeatureValue()
  }
}
