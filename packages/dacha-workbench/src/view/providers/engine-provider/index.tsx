import React, { FC } from 'react'
import type { UiInitFnOptions } from 'remiz'

interface EngineProviderProps extends UiInitFnOptions {
  children: JSX.Element | Array<JSX.Element>
}

export const EngineContext = React.createContext<UiInitFnOptions>({} as UiInitFnOptions)

export const EngineProvider: FC<EngineProviderProps> = ({
  children,
  ...engineOptions
}): JSX.Element => (
  <EngineContext.Provider value={engineOptions}>
    {children}
  </EngineContext.Provider>
)
