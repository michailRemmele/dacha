import React from 'react'
import { createRoot } from 'react-dom/client'
import type { UiInitFn, UiDestroyFn } from 'remiz'

import {
  Explorer,
  Inspector,
} from './modules'
import { EngineProvider } from './providers'

const explorerRoot = createRoot(document.getElementById('explorer-root') as HTMLElement)
const inspectorRoot = createRoot(document.getElementById('inspector-root') as HTMLElement)

export const onInit: UiInitFn = (options) => {
  explorerRoot.render(
    <EngineProvider {...options}>
      <Explorer />
    </EngineProvider>,
  )

  inspectorRoot.render(
    <EngineProvider {...options}>
      <Inspector />
    </EngineProvider>,
  )
}

export const onDestroy: UiDestroyFn = () => {
  explorerRoot.unmount()
  inspectorRoot.unmount()
}
