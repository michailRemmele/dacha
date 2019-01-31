import WebGlRenderProcessor from './webGlRenderProcessor/webGlRenderProcessor';

class RenderProcessor {
  constructor() {
    this.renderProcessor = new WebGlRenderProcessor();
  }

  process() {
    this.renderProcessor.process();
  }
}

export default RenderProcessor;
