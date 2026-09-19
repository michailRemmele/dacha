export const importAll = (modules: Record<string, unknown>): unknown[] =>
  Object.values(modules).map(
    (module) => (module as Record<string, unknown>).default,
  );
