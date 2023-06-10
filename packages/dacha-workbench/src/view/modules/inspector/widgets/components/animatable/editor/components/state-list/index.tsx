import { useState, FC } from 'react'

import { List } from './list'
import { ActionBar } from './action-bar'

interface StateListProps {
  className?: string
}

export const StateList: FC<StateListProps> = ({
  className = '',
}) => {
  const [expandedKeys, setExpandedKeys] = useState<Array<string>>([])

  return (
    <div className={className}>
      <ActionBar expandedKeys={expandedKeys} setExpandedKeys={setExpandedKeys} />
      <List expandedKeys={expandedKeys} setExpandedKeys={setExpandedKeys} />
    </div>
  )
}
