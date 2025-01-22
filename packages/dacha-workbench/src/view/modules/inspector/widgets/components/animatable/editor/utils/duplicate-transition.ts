import { v4 as uuidv4 } from 'uuid'
import type { Animation } from 'dacha'

export const duplicateTransition = (
  transition: Animation.TransitionConfig,
): Animation.TransitionConfig => {
  const duplicate = structuredClone(transition)
  duplicate.id = uuidv4()

  return duplicate
}
