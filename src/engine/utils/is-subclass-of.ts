export const isSubclassOf = (subclass: unknown, superclass: unknown): boolean => {
  let proto: unknown = Object.getPrototypeOf(subclass);
  while (proto) {
    if (proto === superclass) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
};
