import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
  FC,
} from 'react'
import type { UIOptions, LoadUIFn } from 'dacha'
import {
  Engine,
  MouseInputSystem,
  MouseControlSystem,
  CameraSystem,
  UIBridge,
  Renderer,
  Transform,
  Camera,
  MouseControl,
} from 'dacha'

import { CommandContext } from '../command-provider'
import { getEditorConfig } from '../../../engine/config'
import {
  ProjectLoader,
  SceneViewer,
  ToolManager,
  ZoomToolSystem,
  HandToolSystem,
  PointerToolSystem,
  TemplateToolSystem,
  ShapesRenderer,
  GridSystem,
  SettingsSystem,
  Tool,
  ToolController,
  Shape,
  Settings,
  Frame,
} from '../../../engine'

const REQUIRED_GLOBAL_OPTIONS = [
  'sorting',
]

interface EngineProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const EngineContext = React.createContext<UIOptions>({} as UIOptions)

export const EngineProvider: FC<EngineProviderProps> = ({ children }): JSX.Element => {
  const { store } = useContext(CommandContext)

  const [context, setContext] = useState<UIOptions>()

  const globalOptions = useMemo(() => {
    const projectConfig = window.electron.getProjectConfig()
    return projectConfig.globalOptions
      .filter((option) => REQUIRED_GLOBAL_OPTIONS.includes(option.name))
  }, [])

  const editorEngine = useMemo(() => new Engine({
    config: getEditorConfig({ globalOptions, store }),
    systems: [
      MouseInputSystem,
      MouseControlSystem,
      CameraSystem,
      UIBridge,
      Renderer,
      ProjectLoader,
      SceneViewer,
      ToolManager,
      ZoomToolSystem,
      HandToolSystem,
      PointerToolSystem,
      TemplateToolSystem,
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
      Frame,
    ],
    resources: {
      [ProjectLoader.systemName]: {
        store,
      },
      [UIBridge.systemName]: {
        loadUI: (): ReturnType<LoadUIFn> => Promise.resolve({
          onInit: (options: UIOptions): void => setContext(options),
          onDestroy: (): void => setContext(void 0),
        }),
      },
    },
  }), [globalOptions])

  useEffect(() => {
    void editorEngine.play()
  }, [editorEngine])

  return (
    <EngineContext.Provider value={context as UIOptions}>
      {children}
    </EngineContext.Provider>
  )
}
