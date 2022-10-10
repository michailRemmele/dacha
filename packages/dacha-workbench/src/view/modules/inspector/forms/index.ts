import type { FC } from 'react'

import { SceneForm } from './scene-form'
import { LevelForm } from './level-form'

export const forms: Record<string, FC> = {
  scene: SceneForm,
  level: LevelForm,
}
