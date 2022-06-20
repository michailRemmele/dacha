import React from 'react'
import { createRoot } from 'react-dom/client'
import type { UiInitFn, UiDestroyFn } from 'remiz'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import {
  Explorer,
  Inspector,
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
