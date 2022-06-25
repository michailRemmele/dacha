import React from 'react'
import { createRoot } from 'react-dom/client'
import type { UiInitFn, UiDestroyFn } from 'remiz'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import {
  EXPLORER_ROOT,
  INSPECTOR_ROOT,
  TOOLBAR_ROOT,
} from '../consts/root-nodes'

import {
  Explorer,
  Inspector,
  Toolbar,
} from './modules'
import { EngineProvider } from './providers'

import en from './locales/en.json'
import './style.less'

void i18next
  .use(initReactI18next)
  .init({
    lng: 'en',
    resources: {
      en: {
        translation: en,
      },
    },
  })

const explorerRoot = createRoot(document.getElementById(EXPLORER_ROOT) as HTMLElement)
const inspectorRoot = createRoot(document.getElementById(INSPECTOR_ROOT) as HTMLElement)
const toolbarRoot = createRoot(document.getElementById(TOOLBAR_ROOT) as HTMLElement)

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

  toolbarRoot.render(
    <EngineProvider {...options}>
      <Toolbar />
    </EngineProvider>,
  )
}

export const onDestroy: UiDestroyFn = () => {
  explorerRoot.unmount()
  inspectorRoot.unmount()
  toolbarRoot.unmount()
}
