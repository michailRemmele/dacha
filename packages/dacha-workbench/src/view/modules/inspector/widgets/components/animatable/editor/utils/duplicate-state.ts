import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { Animation } from 'dacha'

export const duplicateState = (state: Animation.StateConfig): Animation.StateConfig => {
  const duplicate = structuredClone(state)
  duplicate.id = uuidv4()
  duplicate.name = `${duplicate.name} ${i18next.t('components.animatable.editor.duplicate.appendix.title')}`

  if (duplicate.type === 'group') {
    (duplicate as Animation.GroupStateConfig).substates.forEach((substate) => {
      substate.id = uuidv4()
    })
  }

  return duplicate
}
