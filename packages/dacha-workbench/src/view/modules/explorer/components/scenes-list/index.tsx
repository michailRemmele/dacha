import { FC } from 'react'

import { ActionBar } from './action-bar'
import { SceneTree } from './tree'

interface ScenesListProps {
  isLoaders?: boolean
}

export const ScenesList: FC<ScenesListProps> = ({ isLoaders }) => (
  <>
    <ActionBar isLoaders={isLoaders} />
    <SceneTree isLoaders={isLoaders} />
  </>
)
