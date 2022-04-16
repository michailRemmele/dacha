import { Component } from '../engine/component';

export const createMockComponent = (name: string, config?: Record<string, unknown>): Component => ({
  componentName: name,
  clone: () => createMockComponent(name, config),
  getParentComponent: () => {},
  entity: void 0,
  ...config,
});
