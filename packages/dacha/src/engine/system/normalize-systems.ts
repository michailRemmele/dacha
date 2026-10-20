import type { SystemBinding, SystemConstructor } from './system';

const isBinding = (
  entry: SystemConstructor | SystemBinding,
): entry is SystemBinding => typeof entry === 'object';

export const normalizeSystems = (
  entries: (SystemConstructor | SystemBinding)[],
): SystemBinding[] => {
  const systems = new Map<string, SystemBinding>();
  const bound = new Set<string>();

  entries.forEach((entry) => {
    if (!isBinding(entry)) {
      if (!systems.has(entry.systemName)) {
        systems.set(entry.systemName, {
          system: entry,
          dependencies: undefined,
        });
      }
      return;
    }

    const name = entry.system.systemName;
    if (bound.has(name)) {
      throw new Error(
        `System "${name}" is passed with() more than once. Pass its dependencies in one with() call.`,
      );
    }
    bound.add(name);
    systems.set(name, {
      system: entry.system,
      dependencies: entry.dependencies,
    });
  });

  return [...systems.values()];
};
