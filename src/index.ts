import { Engine } from './engine';
import { Component } from './engine/component';
import { systems as contribSystems } from './contrib/systems';
import contribComponents from './contrib/components';
import IOC from './engine/ioc/ioc';
import { VectorOps, MathOps, Vector2 } from './engine/mathLib';
import { RESOURCES_LOADER_KEY_NAME } from './engine/consts/global';

export type {
  System,
  SystemOptions,
  UpdateOptions,
  HelperFn,
} from './engine/system';
export type { Script, ScriptOptions } from './contrib/systems/script-system';

export {
  Engine,
  Component,
  contribSystems,
  contribComponents,
  IOC,
  VectorOps,
  MathOps,
  Vector2,
  RESOURCES_LOADER_KEY_NAME,
};
