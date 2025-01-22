import { Component } from 'dacha'

export interface ToolControllerConfig extends Record<string, unknown> {
  activeTool: string;
}

export class ToolController extends Component {
  activeTool: string

  constructor(config: Record<string, unknown>) {
    super()

    const { activeTool } = config as ToolControllerConfig

    this.activeTool = activeTool
  }

  clone(): ToolController {
    return new ToolController({
      activeTool: this.activeTool,
    })
  }
}

ToolController.componentName = 'ToolController'
