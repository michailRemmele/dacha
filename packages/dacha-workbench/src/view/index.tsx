import React, { useContext } from 'react'

import { CANVAS_ROOT, SHAPE_CANVAS_ROOT } from '../consts/root-nodes'

import {
  Explorer,
  Inspector,
  Toolbar,
} from './modules'
import { EngineContext } from './providers'

import './style.less'

export const App = (): JSX.Element => {
  const context = useContext(EngineContext)

  return (
    <>
      <div className="editor__explorer">
        {context && <Explorer />}
      </div>
      <div className="editor__canvas">
        <div className="editor__toolbar">
          {context && <Toolbar />}
        </div>
        <div id={CANVAS_ROOT} />
        <canvas id={SHAPE_CANVAS_ROOT} />
      </div>
      <div className="editor__inspector">
        {context && <Inspector />}
      </div>
    </>
  )
}
