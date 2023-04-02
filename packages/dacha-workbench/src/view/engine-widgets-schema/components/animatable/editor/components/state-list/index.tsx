import React, { FC } from 'react'

import { List } from './list'
import { ActionBar } from './action-bar'

import './style.less'

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
