import type { CommanderStore } from '../store'
import { persistentStorage } from '../persistent-storage'

export const getSavedSelectedEntity = (store: CommanderStore): string[] | undefined => {
  const path = persistentStorage.get<string[] | undefined>('selectedEntity')
  return path && store.get(path) ? path : undefined
}
