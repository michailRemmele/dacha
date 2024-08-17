import type { FC } from 'react'

import { ActionBar } from './action-bar'
import { LevelsTree } from './tree'

import { TreeCSS } from './level-tree.style'

export const LevelsExplorer: FC = () => (
  <>
    <ActionBar />
    <LevelsTree css={TreeCSS} />
  </>
)
