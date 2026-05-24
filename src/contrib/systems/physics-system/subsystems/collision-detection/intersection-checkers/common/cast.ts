export const chooseNearestIntersection = <T extends { distance: number }>(
  nearest: T | false,
  candidate: T | false,
): T | false => {
  if (!candidate) {
    return nearest;
  }

  if (!nearest || candidate.distance! < nearest.distance!) {
    return candidate;
  }

  return nearest;
};
