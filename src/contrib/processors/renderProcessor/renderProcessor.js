import Processor from 'engine/processor/processor';
import WebGlRenderProcessor from './webGlRenderProcessor/webGlRenderProcessor';

class RenderProcessor extends Processor {
  constructor(window, textureAtlas, textureAtlasDescriptor) {
    super();
    this.renderProcessor = new WebGlRenderProcessor(window, textureAtlas, textureAtlasDescriptor);
  }

  processorDidMount() {
    this.renderProcessor.processorDidMount();
  }

  processorWillUnmount() {
    this.renderProcessor.processorWillUnmount();
  }

  process() {
    this.renderProcessor.process();
  }
}

export default RenderProcessor;
