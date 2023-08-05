import type { FC } from 'react'

import { List } from './list'
import { ActionBar } from './action-bar'

interface StateListProps {
  className?: string
}

export const StateList: FC<StateListProps> = ({
  className = '',
}) => (
  <div className={className}>
    <ActionBar />
    <List />
  </div>
)
