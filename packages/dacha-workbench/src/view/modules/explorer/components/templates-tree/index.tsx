import type { FC } from 'react'

import { ActionBar } from './action-bar'
import { TemplatesTree } from './tree'

export const TemplatesExplorer: FC = () => (
  <>
    <ActionBar />
    <TemplatesTree />
  </>
)
