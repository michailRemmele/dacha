import Processor from 'engine/processor/processor';
import WebGlRenderProcessor from './webGlRenderProcessor/webGlRenderProcessor';

class RenderProcessor extends Processor {
  constructor(options) {
    super();
    this.renderProcessor = new WebGlRenderProcessor(options);
  }

  processorDidMount() {
    this.renderProcessor.processorDidMount();
  }

  processorWillUnmount() {
    this.renderProcessor.processorWillUnmount();
  }

  getComponentList() {
    return this.renderProcessor.getComponentList();
  }

  process() {
    this.renderProcessor.process();
  }
}

export default RenderProcessor;
