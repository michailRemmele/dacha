import React from 'react'
import { createRoot } from 'react-dom/client'

import {
  Layout,
} from './components'
import { EngineProvider } from './providers'
import { Main } from './pages'

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <EngineProvider>
    <Layout>
      <Main />
    </Layout>
  </EngineProvider>,
)
