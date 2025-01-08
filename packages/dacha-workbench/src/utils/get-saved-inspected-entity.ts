import type { CommanderStore } from '../store'
import { persistentStorage } from '../persistent-storage'

export const getSavedInspectedEntity = (store: CommanderStore): string[] | undefined => {
  const path = persistentStorage.get<string[] | undefined>('inspectedEntity')
  return path && store.get(path) ? path : undefined
}
