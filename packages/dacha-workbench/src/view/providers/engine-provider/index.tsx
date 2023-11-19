import React, {
  useState,
  useMemo,
  useEffect,
  FC,
} from 'react'
import type { UiInitFnOptions } from 'remiz'
import {
  Engine,
  MouseInputSystem,
  MouseControlSystem,
  CameraSystem,
  UiBridge,
  SpriteRenderer,
  Transform,
  Camera,
  MouseControl,
} from 'remiz'

import { getEditorConfig } from '../../../engine/config'
import {
  ProjectLoader,
  LevelViewer,
  ToolManager,
  ZoomToolSystem,
  HandToolSystem,
  PointerToolSystem,
  TemplateToolSystem,
  Commander,
  ShapesRenderer,
  GridSystem,
  SettingsSystem,
  Tool,
  ToolController,
  Shape,
  Settings,
} from '../../../engine'

const REQUIRED_GLOBAL_OPTIONS = [
  'sortingLayers',
]

interface EngineProviderProps {
  children: JSX.Element | Array<JSX.Element>
}

export const EngineContext = React.createContext<UiInitFnOptions>({} as UiInitFnOptions)

export const EngineProvider: FC<EngineProviderProps> = ({ children }): JSX.Element => {
  const [context, setContext] = useState<UiInitFnOptions>()

  const globalOptions = useMemo(() => {
    const projectConfig = window.electron.getProjectConfig()
    return projectConfig.globalOptions
      .filter((option) => REQUIRED_GLOBAL_OPTIONS.includes(option.name))
  }, [])

  const editorEngine = useMemo(() => new Engine({
    config: getEditorConfig({ globalOptions }),
    systems: [
      MouseInputSystem,
      MouseControlSystem,
      CameraSystem,
      UiBridge,
      SpriteRenderer,
      ProjectLoader,
      LevelViewer,
      ToolManager,
      ZoomToolSystem,
      HandToolSystem,
      PointerToolSystem,
      TemplateToolSystem,
      Commander,
      ShapesRenderer,
      GridSystem,
      SettingsSystem,
    ],
    components: [
      Transform,
      Camera,
      MouseControl,
      Tool,
      ToolController,
      Shape,
      Settings,
    ],
    resources: {
      [UiBridge.systemName]: {
        loadUiApp: () => Promise.resolve({
          onInit: (options: UiInitFnOptions): void => setContext(options),
          onDestroy: (): void => setContext(void 0),
        }),
      },
    },
  }), [globalOptions])

  useEffect(() => {
    void editorEngine.play()
  }, [editorEngine])

  return (
    <EngineContext.Provider value={context as UiInitFnOptions}>
      {children}
    </EngineContext.Provider>
  )
}
