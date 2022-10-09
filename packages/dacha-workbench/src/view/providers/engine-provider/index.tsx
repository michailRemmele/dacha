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

import config from '../../../engine/config.json'
import { editorSystems, editorComponents } from '../../../engine'

interface EngineProviderProps {
  children: JSX.Element | Array<JSX.Element>
}

export const EngineContext = React.createContext<UiInitFnOptions>({} as UiInitFnOptions)

export const EngineProvider: FC<EngineProviderProps> = ({ children }): JSX.Element => {
  const [context, setContext] = useState<UiInitFnOptions>()

  const editorEngine = useMemo(() => new Engine({
    config,
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
  }), [])

  useEffect(() => {
    void editorEngine.start()
  }, [editorEngine])

  return (
    <EngineContext.Provider value={context as UiInitFnOptions}>
      {children}
    </EngineContext.Provider>
  )
}
