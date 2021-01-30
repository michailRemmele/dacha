export const getComponentValue = (path, gameObject) => {
  const componentName = path[0];
  let soughtValue = gameObject.getComponent(componentName);

  for (let i = 1; i < path.length && soughtValue !== undefined; i++) {
    soughtValue = soughtValue[path[i]];
  }

  return soughtValue;
};
