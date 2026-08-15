import type { ExplorerEntity } from '../types/explorer-entity'

export const getUniqueName = (
  oldName: string,
  destintation: ExplorerEntity[],
): string => {
  const names = new Set(destintation.map((entity) => entity.name))

  if (!names.has(oldName)) {
    return oldName
  }

  const nameParts = oldName.split(' ')
  let baseName = oldName
  let index = 2

  if (nameParts.length > 1 && (nameParts.at(-1) as string).match(/^[0-9]+$/)) {
    baseName = nameParts.slice(0, -1).join('')
    index = Number(nameParts.at(-1)) + 1
  }

  while (names.has(`${baseName} ${index}`)) {
    index += 1
  }

  return `${baseName} ${index}`
}
