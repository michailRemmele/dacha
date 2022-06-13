import React, { useCallback, useContext, FC } from 'react'
import type { Config } from 'remiz'

import { EngineContext } from '../../providers'

import './style.css'

const SELECT_LEVEL_MSG = 'SELECT_LEVEL'

interface LevelButtonProps {
  onClick: (name: string) => void
  name: string
}

const LevelButton: FC<LevelButtonProps> = ({ onClick, name }) => {
  const handleClick = useCallback(
    () => onClick(name),
    [onClick, name],
  )

  return (
    <button type="button" onClick={handleClick}>
      {name}
    </button>
  )
}

export const Explorer = (): JSX.Element => {
  const { sceneContext, pushMessage } = useContext(EngineContext)

  const { levels } = sceneContext.data.projectConfig as Config

  const handleSelect = useCallback((name: string) => pushMessage({
    type: SELECT_LEVEL_MSG,
    name,
  }), [pushMessage])

  return (
    <div className="explorer">
      <ul className="explorer__levels">
        {levels.map((level) => (
          <li key={level.name}>
            <LevelButton onClick={handleSelect} name={level.name} />
            <ul>
              {level.gameObjects.map((gameObject) => (
                <li key={`${level.name}-${gameObject.name}`}>
                  {gameObject.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
