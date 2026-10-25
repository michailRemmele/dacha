import type { ReferenceSources, ReferenceWalker } from 'dacha';

/**
 * Rewrites, in place, every reference in `sources` whose id is a key of `idMap`.
 */
export const remapReferences = (
  walker: ReferenceWalker,
  sources: ReferenceSources,
  idMap: Map<string, string>,
): void => {
  walker.visit(sources, ({ id }) => idMap.get(id));
};
