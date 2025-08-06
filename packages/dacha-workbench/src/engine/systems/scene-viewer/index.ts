import {
  SceneSystem,
  ActorCollection,
  ActorCreator,
  TemplateCollection,
} from 'dacha'
import type {
  World,
  Scene,
  SceneSystemOptions,
  ActorSpawner,
  TemplateConfig,
  SceneConfig,
} from 'dacha'

import { EventType } from '../../../events'
import type { SelectSceneEvent } from '../../../events'
import type { EditorConfig } from '../../../types/global'
import type { CommanderStore, ListenerFn } from '../../../store'
import { includesArray } from '../../../utils/includes-array'
import { getSavedSelectedSceneId } from '../../../utils/get-saved-selected-scene-id'

import { ALLOWED_COMPONENTS } from './consts'
import { omit, removeAllChildren } from './utils'
import {
  watchTemplates,
  watchActors,
} from './watchers'
import type { WatcherOptions } from './watchers'

interface SceneViewerOptions extends SceneSystemOptions {
  mainActorId: string;
}

export class SceneViewer extends SceneSystem {
  world: World
  editorScene: Scene
  actorSpawner: ActorSpawner
  actorCollection: ActorCollection
  mainActorId: string
  configStore: CommanderStore
  editorConfig: EditorConfig
  actorCreator: ActorCreator
  currentScene?: string
  templateCollection: TemplateCollection
  subscription?: () => void
  prevScene?: SceneConfig

  constructor(options: SceneSystemOptions) {
    super()

    const {
      world,
      scene,
      actorSpawner,
      mainActorId,
    } = options as SceneViewerOptions

    this.world = world
    this.editorScene = scene
    this.actorSpawner = actorSpawner
    this.actorCollection = new ActorCollection(scene)
    this.mainActorId = mainActorId

    this.configStore = world.data.configStore as CommanderStore
    this.editorConfig = world.data.editorConfig as EditorConfig

    const mainActor = scene.findChildById(mainActorId)

    if (!mainActor) {
      throw new Error('Can\'t find the main actor')
    }

    this.world.data.mainActor = mainActor

    const templateCollection = new TemplateCollection(ALLOWED_COMPONENTS)
    const templates = this.configStore.get(['templates']) as TemplateConfig[]

    templates.forEach((template) => {
      templateCollection.register(omit(template))
    })

    this.templateCollection = templateCollection
    this.actorCreator = new ActorCreator(ALLOWED_COMPONENTS, templateCollection)

    this.world.data.actorCreator = this.actorCreator

    const selectedSceneId = getSavedSelectedSceneId(this.configStore)
    if (selectedSceneId) {
      this.loadScene(selectedSceneId)
    }
    this.world.addEventListener(EventType.SelectScene, this.handleSelectScene)
    this.watchStore()
  }

  onSceneDestroy(): void {
    this.world.removeEventListener(EventType.SelectScene, this.handleSelectScene)
    this.subscription?.()
  }

  private watchStore(): void {
    const listener: ListenerFn = (path) => {
      const scenePath = this.currentScene && ['scenes', `id:${this.currentScene}`]
      const scene = scenePath ? this.configStore.get(scenePath) as SceneConfig : undefined

      const options: WatcherOptions = {
        path,
        store: this.configStore,
        editorScene: this.editorScene,
        actorCollection: this.actorCollection,
        actorCreator: this.actorCreator,
        templateCollection: this.templateCollection,
        scene,
        prevScene: this.prevScene,
      }

      if (includesArray(path, ['templates'])) {
        watchTemplates(options)
      }
      if (this.currentScene && includesArray(path, ['scenes'])) {
        watchActors(options)
      }

      this.prevScene = scene
    }

    this.subscription = this.configStore.subscribe(listener)
  }

  private handleSelectScene = (event: SelectSceneEvent): void => {
    if (this.currentScene === event.sceneId) {
      return
    }

    removeAllChildren(this.editorScene, this.mainActorId)
    this.loadScene(event.sceneId)
  }

  private loadScene(sceneId?: string): void {
    const scenes = this.configStore.get(['scenes']) as SceneConfig[]
    const selectedScene = scenes.find((scene) => scene.id === sceneId)

    if (selectedScene) {
      selectedScene.actors.forEach((actorConfig) => {
        this.editorScene.appendChild(this.actorCreator.create(omit(actorConfig)))
      })
    }

    this.prevScene = selectedScene
    this.currentScene = sceneId
  }
}

SceneViewer.systemName = 'SceneViewer'
