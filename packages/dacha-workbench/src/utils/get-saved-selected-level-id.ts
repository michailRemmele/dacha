import type { CommanderStore } from '../store'
import { persistentStorage } from '../persistent-storage'

export const getSavedSelectedLevelId = (store: CommanderStore): string | undefined => {
  const selectedLevelId = persistentStorage.get<string | undefined>('selectedLevel')
  return selectedLevelId && store.get(['levels', `id:${selectedLevelId}`])
    ? selectedLevelId
    : undefined
}
