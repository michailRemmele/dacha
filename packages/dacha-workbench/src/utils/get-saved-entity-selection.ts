import type { CommanderStore } from '../store'
import { persistentStorage } from '../persistent-storage'

export const getSavedEntitySelection = (store: CommanderStore): string[][] => {
  const paths = persistentStorage.get<string[][]>('entitySelection', [])
  return paths.filter((path) => store.get(path))
}
