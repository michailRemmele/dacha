import type { CommanderStore } from '../store'
import { persistentStorage } from '../persistent-storage'

export const getSavedSelectedSceneId = (store: CommanderStore): string | undefined => {
  const selectedSceneId = persistentStorage.get<string | undefined>('selectedScene')
  return selectedSceneId && store.get(['scenes', `id:${selectedSceneId}`])
    ? selectedSceneId
    : undefined
}
