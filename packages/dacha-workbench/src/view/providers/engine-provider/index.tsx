import React, {
  useState,
  useMemo,
  useEffect,
  FC,
} from 'react'
import type { UiInitFnOptions } from 'remiz'
import {
  Engine,
  contribComponents,
  contribSystems,
} from 'remiz'

import { getEditorConfig } from '../../../engine/config'
import { editorSystems, editorComponents } from '../../../engine'

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
    systems: {
      ...contribSystems,
      ...editorSystems,
    },
    components: {
      ...contribComponents,
      ...editorComponents,
    },
    helpers: {
      loadUiApp: () => Promise.resolve({
        onInit: (options: UiInitFnOptions): void => setContext(options),
        onDestroy: (): void => setContext(void 0),
      }),
    },
  }), [globalOptions])

  useEffect(() => {
    void editorEngine.start()
  }, [editorEngine])

  return (
    <EngineContext.Provider value={context as UiInitFnOptions}>
      {children}
    </EngineContext.Provider>
  )
}
