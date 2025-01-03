export const LEVEL_PATH_LEGTH = 2

export const getActorIdByPath = (path?: Array<string>): string | undefined => {
  if (path !== undefined && path[0] === 'levels' && path.length > LEVEL_PATH_LEGTH) {
    return path.at(-1)?.split(':').at(-1)
  }
  return undefined
}
