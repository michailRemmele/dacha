import type { GameObject } from 'remiz'

const accumulatePath = (gameObject: GameObject, path: Array<string>): void => {
  path.unshift(`id:${gameObject.id}`)

  if (gameObject.parent !== undefined) {
    path.unshift('children')
    accumulatePath(gameObject.parent, path)
  }
}

export const buildGameObjectPath = (gameObject: GameObject, levelId: string): Array<string> => {
  const path: Array<string> = []

  accumulatePath(gameObject, path)
  path.unshift('levels', `id:${levelId}`, 'gameObjects')

  return path
}
