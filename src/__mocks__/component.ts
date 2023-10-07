import { Component } from '../engine/component';

export const createMockComponent = (name: string, config?: Record<string, unknown>): Component => ({
  clone: () => createMockComponent(name, config),
  getParentComponent: (): void => {},
  gameObject: void 0,
  ...config,
});
