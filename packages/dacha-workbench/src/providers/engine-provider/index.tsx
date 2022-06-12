import React, {
  useEffect,
  useMemo,
  useState,
  FC,
} from 'react'
import {
  Engine,
  contribComponents,
  contribSystems,
  UiInitFnOptions,
} from 'remiz'

import config from '../../engine/config.json'
import { editorSystems } from '../../engine'

interface EngineProviderProps {
  children: JSX.Element | Array<JSX.Element>
}

export const EngineContext = React.createContext<UiInitFnOptions>({} as UiInitFnOptions)

export const EngineProvider: FC<EngineProviderProps> = ({ children }): JSX.Element => {
  const [context, setContext] = useState<UiInitFnOptions>({} as UiInitFnOptions)

  const engine = useMemo(() => new Engine({
    config,
    systems: {
      ...contribSystems,
      ...editorSystems,
    },
    components: {
      ...contribComponents,
    },
    helpers: {
      loadUiApp: () => Promise.resolve({
        onInit: (options: UiInitFnOptions): void => setContext(options),
        onDestroy: (): void => {},
      }),
    },
  }), [])

  useEffect(() => {
    void engine.start()
  }, [engine])

  return (
    <EngineContext.Provider value={context}>
      {children}
    </EngineContext.Provider>
  )
}
