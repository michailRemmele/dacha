export const expectHit = <T>(hit: T | false, label: string): T => {
  expect(hit).not.toBe(false);

  if (hit === false) {
    throw new Error(`Expected ${label}, received false`);
  }

  return hit;
};
