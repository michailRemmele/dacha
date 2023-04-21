import React, { useState, FC } from 'react'

import { ActionBar } from './action-bar'
import { Tree } from './tree'

import './style.less'

export const LevelsTree: FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<Array<string>>([])
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>()

  return (
    <>
      <ActionBar
        expandedKeys={expandedKeys}
        setExpandedKeys={setExpandedKeys}
        setSelectedLevel={setSelectedLevel}
      />
      <Tree
        expandedKeys={expandedKeys}
        setExpandedKeys={setExpandedKeys}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
      />
    </>
  )
}
