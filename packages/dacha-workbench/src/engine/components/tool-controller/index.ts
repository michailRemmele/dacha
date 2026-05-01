import { Component } from 'dacha';

export interface ToolControllerConfig {
  activeTool: string;
}

export class ToolController extends Component {
  activeTool: string;

  constructor(config: ToolControllerConfig) {
    super();

    this.activeTool = config.activeTool;
  }
}

ToolController.componentName = 'ToolController';
