import React, { useEffect, useState } from 'react'
import type { Config } from 'remiz'

import './style.css'

export const GameConfigInfo = (): JSX.Element | null => {
  const [gameConfig, setGameConfig] = useState<Config>()

  useEffect(() => {
    setGameConfig(window.electron.getGameConfig())
  }, [])

  if (!gameConfig) {
    return null
  }

  return (
    <div className="game-config-info">
      <span className="game-config-info__field">
        {`Scenes count: ${gameConfig.scenes.length}`}
      </span>
      <span className="game-config-info__field">
        {`Levels count: ${gameConfig.levels.length}`}
      </span>
      <span className="game-config-info__field">
        {`Templates count: ${gameConfig.templates.length}`}
      </span>
    </div>
  )
}
