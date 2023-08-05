import type { FC } from 'react'

import { ActionBar } from './action-bar'
import { Tree } from './tree'

import { TreeCSS } from './level-tree.style'

export const LevelsTree: FC = () => (
  <>
    <ActionBar />
    <Tree css={TreeCSS} />
  </>
)
