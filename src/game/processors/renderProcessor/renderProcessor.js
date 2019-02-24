import WebGlRenderProcessor from './webGlRenderProcessor/webGlRenderProcessor';

class RenderProcessor {
  constructor(resources) {
    this.renderProcessor = new WebGlRenderProcessor(resources);
  }

  process() {
    this.renderProcessor.process();
  }
}

export default RenderProcessor;
