import type { ReconcileFix } from '..';

const stepInto = (node: unknown, segment: string): unknown => {
  if (Array.isArray(node)) {
    const [key, value] = segment.split(':');
    return node.find(
      (item) => (item as Record<string, unknown>)[key] === value,
    );
  }
  return (node as Record<string, unknown>)[segment];
};

const setAt = (node: unknown, segment: string, value: unknown): void => {
  if (Array.isArray(node)) {
    const [key, keyValue] = segment.split(':');
    const index = node.findIndex(
      (item) => (item as Record<string, unknown>)[key] === keyValue,
    );
    node[index] = value;
  } else {
    (node as Record<string, unknown>)[segment] = value;
  }
};

export const applyFixes = <T>(config: T, fixes: ReconcileFix[]): T => {
  const result = structuredClone(config);
  fixes.forEach((fix) => {
    let node: unknown = result;
    for (let i = 0; i < fix.path.length - 1; i += 1) {
      node = stepInto(node, fix.path[i]);
    }
    setAt(node, fix.path[fix.path.length - 1], structuredClone(fix.value));
  });
  return result;
};
