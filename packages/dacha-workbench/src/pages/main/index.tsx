import React, { useContext, FC } from 'react'

import { Explorer } from '../../components'
import { EngineContext } from '../../providers'

import './style.css'

export const Main: FC = () => {
  const { sceneContext } = useContext(EngineContext)

  return (
    <div className="main">
      <div className="main__explorer">
        {sceneContext && <Explorer />}
      </div>
      <div className="main__canvas" id="canvas" />
      <div className="main__inspector" />
    </div>
  )
}
