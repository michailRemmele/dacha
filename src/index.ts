import Engine from './engine/engine';
import { Component } from './engine/component';
import { systemsPlugins as contribSystemsPlugins } from './contrib/system-plugins';
import contribComponents from './contrib/components';
import IOC from './engine/ioc/ioc';
import { VectorOps, MathOps, Vector2 } from './engine/mathLib';
import {
  RESOURCES_LOADER_KEY_NAME,
  PROJECT_SETTINGS_KEY_NAME,
} from './engine/consts/global';

export {
  SystemPlugin,
  SystemPluginOptions,
  System,
  SystemOptions,
} from './engine/system';
export { Script, ScriptOptions } from './contrib/systems/script-system';

export {
  Engine,
  Component,
  contribSystemsPlugins,
  contribComponents,
  IOC,
  VectorOps,
  MathOps,
  Vector2,
  RESOURCES_LOADER_KEY_NAME,
  PROJECT_SETTINGS_KEY_NAME,
};
