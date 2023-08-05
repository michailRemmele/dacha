export const getKey = (path?: Array<string>): string | undefined => path?.at(-1)?.split(':')[1]
