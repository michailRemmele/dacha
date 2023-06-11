import { useState, FC } from 'react'

import { ActionBar } from './action-bar'
import { Tree } from './tree'

export const TemplatesTree: FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<Array<string>>([])

  return (
    <>
      <ActionBar
        expandedKeys={expandedKeys}
        setExpandedKeys={setExpandedKeys}
      />
      <Tree
        expandedKeys={expandedKeys}
        setExpandedKeys={setExpandedKeys}
      />
    </>
  )
}
