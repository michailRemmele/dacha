import WebGlRenderProcessor from './webGlRenderProcessor/webGlRenderProcessor';

class RenderProcessor {
  constructor(window, textureAtlas, textureAtlasDescriptor) {
    this.renderProcessor = new WebGlRenderProcessor(window, textureAtlas, textureAtlasDescriptor);
  }

  process() {
    this.renderProcessor.process();
  }
}

export default RenderProcessor;
