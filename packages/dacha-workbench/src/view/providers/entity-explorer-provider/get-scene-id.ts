export const getSceneId = (
  path?: string[],
): string | undefined => (path?.[0] === 'scenes' ? path[1].split(':')[1] : undefined)
