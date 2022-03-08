import Engine from './engine/engine';
import { Component } from './engine/component';
import { processorsPlugins as contribProcessorsPlugins } from './contrib/processors-plugins';
import contribComponents from './contrib/components';
import IOC from './engine/ioc/ioc';
import { VectorOps, MathOps, Vector2 } from './engine/mathLib';
import {
  RESOURCES_LOADER_KEY_NAME,
  PROJECT_SETTINGS_KEY_NAME,
} from './engine/consts/global';

export {
  ProcessorPlugin,
  ProcessorPluginOptions,
  Processor,
  ProcessorOptions,
} from './engine/processor';
export { Script, ScriptOptions } from './contrib/processors/script-processor';

export {
  Engine,
  Component,
  contribProcessorsPlugins,
  contribComponents,
  IOC,
  VectorOps,
  MathOps,
  Vector2,
  RESOURCES_LOADER_KEY_NAME,
  PROJECT_SETTINGS_KEY_NAME,
};
