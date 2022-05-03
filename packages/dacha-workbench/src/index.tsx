import React from 'react'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <div>
    Hello world with React!
    Project path:
    {' '}
    {window.electron.getProjectInfo()}
  </div>,
)
