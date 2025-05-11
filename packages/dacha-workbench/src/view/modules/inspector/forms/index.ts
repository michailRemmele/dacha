import { SceneForm } from './scene-form'
import { TemplateForm } from './template-form'
import { ActorForm } from './actor-form'

import type { FormComponentProps, FormComponent } from './types'

export type { FormComponentProps, FormComponent }

export const forms: Record<string, FormComponent> = {
  scene: SceneForm,
  template: TemplateForm,
  actor: ActorForm,
}
