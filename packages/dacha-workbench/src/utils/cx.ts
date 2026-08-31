type ClassName = string | false | null | undefined;

export const cx = (...values: ClassName[]): string =>
  values.filter(Boolean).join(' ');
