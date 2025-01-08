export const getLevelId = (
  path?: Array<string>,
): string | undefined => (path?.[0] === 'levels' ? path[1].split(':')[1] : undefined)
