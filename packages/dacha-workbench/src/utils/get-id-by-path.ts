export const getIdByPath = (path: string[]): string => path.at(-1)?.split(':')[1] as string
