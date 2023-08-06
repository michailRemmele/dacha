import { Component } from 'remiz'

export interface ToolControllerConfig extends Record<string, unknown> {
  activeTool: string;
}

export class ToolController extends Component {
  activeTool: string

  constructor(componentName: string, config: Record<string, unknown>) {
    super(componentName)

    const { activeTool } = config as ToolControllerConfig

    this.activeTool = activeTool
  }

  clone(): ToolController {
    return new ToolController(this.componentName, {
      activeTool: this.activeTool,
    })
  }
}
