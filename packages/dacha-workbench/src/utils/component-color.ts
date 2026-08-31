const HASH_MULTIPLIER = 31;

export const getEntityColorHue = (name: string): number => {
  let hash = 0;

  for (let i = 0; i < name.length; i += 1) {
    hash = (Math.imul(hash, HASH_MULTIPLIER) + name.charCodeAt(i)) >>> 0;
  }

  return hash % 360;
};
