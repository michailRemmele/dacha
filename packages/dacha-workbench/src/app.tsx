import { createRoot } from 'react-dom/client'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { ConfigProvider, theme } from 'antd'
import 'antd/dist/reset.css'

import { App } from './view'
import {
  EngineProvider,
  SelectedEntityProvider,
  ThemeProvider,
} from './view/providers'
import { APP_ROOT } from './consts/root-nodes'

import en from './view/locales/en.json'
import './export'

const customTheme = { algorithm: [theme.compactAlgorithm] }
// const customTheme = { algorithm: [theme.darkAlgorithm, theme.compactAlgorithm] }

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
  <ConfigProvider theme={customTheme}>
    <ThemeProvider>
      <EngineProvider>
        <SelectedEntityProvider>
          <App />
        </SelectedEntityProvider>
      </EngineProvider>
    </ThemeProvider>
  </ConfigProvider>,
)
