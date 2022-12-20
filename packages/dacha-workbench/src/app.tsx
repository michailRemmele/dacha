import React from 'react'
import { createRoot } from 'react-dom/client'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import { App } from './view'
import { EngineProvider, SelectedEntityProvider } from './view/providers'
import { APP_ROOT } from './consts/root-nodes'

import en from './view/locales/en.json'
import './export'

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

const root = createRoot(document.getElementById(APP_ROOT) as HTMLElement)

root.render(
  <EngineProvider>
    <SelectedEntityProvider>
      <App />
    </SelectedEntityProvider>
  </EngineProvider>,
)
