export const toKebabCase = (input: string): string => input
  .trim()
  .replace(/([a-z])([A-Z])/g, '$1-$2')
  .replace(/[\s_-]+/g, '-')
  .toLowerCase()
  .replace(/[^\w-]/g, '')
  .replace(/^-+|-+$/g, '')
