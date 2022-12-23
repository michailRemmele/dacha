export const cn = (
  ...classNames: Array<string | undefined | null | boolean>
): string => classNames.filter(Boolean).join(' ')
