import { SceneForm } from './scene-form'
import { LevelForm } from './level-form'
import { TemplateForm } from './template-form'
import { GameObjectForm } from './game-object-form'

import type { FormComponentProps, FormComponent } from './types'

export type { FormComponentProps, FormComponent }

export const forms: Record<string, FormComponent> = {
  scene: SceneForm,
  level: LevelForm,
  template: TemplateForm,
  gameObject: GameObjectForm,
}
