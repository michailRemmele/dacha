import { Component } from '../engine/component';

export const createMockComponent = (name: string): Component => ({
  componentName: name,
  clone: () => createMockComponent(name),
  getParentComponent: () => {},
  gameObject: void 0,
});
