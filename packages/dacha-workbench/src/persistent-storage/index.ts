import { debounce } from '../utils/debounce'

const TIMEOUT = 300

const debouncedSave = debounce(window.electron.savePersistentStorage, TIMEOUT)

class PeristentStorage {
  private storage: Record<string, unknown>

  constructor() {
    this.storage = window.electron.loadPersistentStorage()
  }

  set(key: string, value: unknown): void {
    this.storage[key] = value

    debouncedSave(this.storage)
  }

  get<T>(key: string, initialValue?: T): T {
    if (this.storage[key] === undefined && initialValue !== undefined) {
      this.set(key, initialValue)
    }

    return this.storage[key] as T
  }

  saveImmediately(): void {
    window.electron.savePersistentStorage(this.storage)
  }
}

export const persistentStorage = new PeristentStorage()
