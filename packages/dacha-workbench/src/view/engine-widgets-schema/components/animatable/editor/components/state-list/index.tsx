import React, { FC } from 'react'

import { List } from './list'
import { ActionBar } from './action-bar'

import './style.less'

interface StateListProps {
  className?: string
  onSelect: (id: string) => void
  onChildSelect: (id: string) => void
}

export const StateList: FC<StateListProps> = ({
  className = '',
  onSelect = (): void => void 0,
  onChildSelect = (): void => void 0,
}) => (
  <div className={className}>
    <ActionBar />
    <List onSelect={onSelect} onChildSelect={onChildSelect} />
  </div>
)
