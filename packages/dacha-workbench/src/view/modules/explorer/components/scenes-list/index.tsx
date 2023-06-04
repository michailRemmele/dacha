import { FC } from 'react'

import { ActionBar } from './action-bar'
import { List } from './list'

interface ScenesListProps {
  isLoaders?: boolean
}

export const ScenesList: FC<ScenesListProps> = ({ isLoaders }) => (
  <>
    <ActionBar isLoaders={isLoaders} />
    <List isLoaders={isLoaders} />
  </>
)
