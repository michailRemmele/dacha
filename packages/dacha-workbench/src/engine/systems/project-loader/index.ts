import { WorldSystem } from 'dacha'
import type {
  World,
  Config,
  WorldSystemOptions,
  UpdateOptions,
} from 'dacha'
import * as Events from 'dacha/events'
import type { Resource } from 'i18next'

import { EventType } from '../../../events'
import { CommanderStore } from '../../../store'
import type { EditorConfig, Extension } from '../../../types/global'
import { deepMerge } from '../../../utils/deep-merge'

const DEFAULT_AUTO_SAVE_INTERVAL = 10_000

interface ProjectLoaderResources {
  store: CommanderStore
}

export class ProjectLoader extends WorldSystem {
  private world: World
  private editorConfig: EditorConfig

  private autoSaveInterval: number

  constructor(options: WorldSystemOptions) {
    super()

    this.world = options.world
    this.editorConfig = window.electron.getEditorConfig()

    this.world.data.configStore = (options.resources as ProjectLoaderResources).store
    this.world.data.editorConfig = this.editorConfig

    this.autoSaveInterval = this.editorConfig.autoSaveInterval ?? DEFAULT_AUTO_SAVE_INTERVAL

    window.electron.onSave(() => {
      this.saveProjectConfig()
    })
  }

  async onWorldLoad(): Promise<void> {
    await Promise.all([
      this.loadScript('/widgets.js'),
      this.loadScript('/events.js'),
      this.loadScript('/locales.js'),
      ...this.editorConfig.libraries
        .map((name) => ([
          `${name}__widgets.js`,
          `${name}__events.js`,
          `${name}__locales.js`,
        ]))
        .flat()
        .map((src) => this.loadScript(src)),
    ])

    this.setUpData({
      events: [
        ...window.events
          ? Object.values(window.events).filter((entry) => typeof entry === 'string')
          : [],
        ...this.editorConfig.libraries
          .map((name) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const libraryEvents = window[`${name}__events`] as Record<string, unknown> | undefined

            return libraryEvents
              ? Object.values(libraryEvents).filter((entry) => typeof entry === 'string')
              : []
          })
          .flat(),
      ],
      locales: this.editorConfig.libraries.reduce((acc: Resource, name) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const libraryLocales = window[`${name}__locales`]?.default as Resource | undefined

        if (libraryLocales) {
          return deepMerge(libraryLocales, acc)
        }

        return acc
      }, window.locales?.default ?? {}),
    })
  }

  private async loadScript(src: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const script = document.createElement('script')
      script.src = src

      script.onload = (): void => resolve()
      script.onerror = (): void => {
        console.warn(`Error while loading bundle: ${src}`)
        resolve()
      }

      document.body.appendChild(script)
    })
  }

  private setUpData(extension: Extension): void {
    const {
      events = [],
      locales = {},
    } = extension

    this.world.data.extension = {
      events: [
        ...events,
        ...Object.values(Events),
      ],
      locales,
    }
  }

  private saveProjectConfig(): void {
    const projectConfig = (this.world.data.configStore as CommanderStore).get([]) as Config
    window.electron.saveProjectConfig(projectConfig)

    this.world.dispatchEvent(EventType.SaveProject)
  }

  update(options: UpdateOptions): void {
    if (!this.editorConfig.autoSave) {
      return
    }

    const { deltaTime } = options

    this.autoSaveInterval -= deltaTime
    if (this.autoSaveInterval <= 0) {
      this.saveProjectConfig()
      this.autoSaveInterval = this.editorConfig.autoSaveInterval ?? DEFAULT_AUTO_SAVE_INTERVAL
    }
  }
}

ProjectLoader.systemName = 'ProjectLoader'
