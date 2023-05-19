import type {
  GameObjectCreator,
  GameObjectDestroyer,
  GameObjectSpawner,
  GameObject,
  Transform,
} from 'remiz'

import {
  TOOL_NAME,
  TRANSFORM_COMPONENT_NAME,
} from '../consts'
import { includesArray } from '../../../../utils/includes-array'
import type { Tool } from '../../../components'
import type { Store } from '../../../../store'

interface PreviewSubsystemOptions {
  gameObjectCreator: GameObjectCreator
  gameObjectDestroyer: GameObjectDestroyer
  gameObjectSpawner: GameObjectSpawner
  mainObject: GameObject
  configStore: Store
}

export class PreviewSubsystem {
  private gameObjectCreator: GameObjectCreator
  private gameObjectDestroyer: GameObjectDestroyer
  private gameObjectSpawner: GameObjectSpawner
  private mainObject: GameObject
  private configStore: Store

  private preview?: GameObject

  private unsubscribe: () => void

  constructor({
    gameObjectCreator,
    gameObjectDestroyer,
    gameObjectSpawner,
    mainObject,
    configStore,
  }: PreviewSubsystemOptions) {
    this.gameObjectCreator = gameObjectCreator
    this.gameObjectDestroyer = gameObjectDestroyer
    this.gameObjectSpawner = gameObjectSpawner
    this.mainObject = mainObject
    this.configStore = configStore

    this.unsubscribe = this.configStore.subscribe(this.handleTemplatesUpdate)
  }

  private deletePreview(): void {
    if (this.preview === undefined) {
      return
    }

    this.gameObjectDestroyer.destroy(this.preview)
    this.preview = undefined
  }

  // TODO: Simplify after gameObject/template creation refactoring
  private spawnPreview(templateId: string): GameObject {
    const preview = this.gameObjectCreator.create({
      templateId,
      fromTemplate: true,
      isNew: true,
    })
    this.gameObjectSpawner.spawn(preview)
    this.mainObject.appendChild(preview)

    return preview
  }

  private handleTemplatesUpdate = (path: Array<string>): void => {
    if (this.preview === undefined) {
      return
    }
    if (!includesArray(path, ['templates', `id:${this.preview.templateId as string}`])) {
      return
    }

    this.deletePreview()
  }

  private updatePreview(tool: Tool, x: number, y: number): void {
    const templateId = tool.features.templateId.value as string | undefined

    if (templateId === undefined) {
      return
    }
    if (this.preview !== undefined && this.preview.templateId !== templateId) {
      this.deletePreview()
    }
    if (this.preview === undefined) {
      this.preview = this.spawnPreview(templateId)
    }

    const transform = this.preview.getComponent(TRANSFORM_COMPONENT_NAME) as Transform | undefined
    if (transform !== undefined) {
      transform.offsetX = Math.round(x)
      transform.offsetY = Math.round(y)
    }
  }

  unmount(): void {
    this.unsubscribe()
  }

  update(tool: Tool, x: number | null, y: number | null): void {
    if (tool.name !== TOOL_NAME || x === null || y === null) {
      this.deletePreview()
      return
    }

    const preview = tool.features.preview.value as boolean
    if (!preview) {
      this.deletePreview()
      return
    }

    this.updatePreview(tool, x, y)
  }
}
