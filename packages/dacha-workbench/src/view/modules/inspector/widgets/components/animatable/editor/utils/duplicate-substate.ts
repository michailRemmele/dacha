import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { Animation } from 'dacha'

export const duplicateSubstate = (substate: Animation.SubstateConfig): Animation.SubstateConfig => {
  const duplicate = structuredClone(substate)
  duplicate.id = uuidv4()
  duplicate.name = `${duplicate.name} ${i18next.t('components.animatable.editor.duplicate.appendix.title')}`

  return duplicate
}
