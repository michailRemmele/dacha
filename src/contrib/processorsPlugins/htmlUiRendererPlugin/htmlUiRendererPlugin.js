import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import HtmlUiRenderer from 'contrib/processors/htmlUiRenderer/htmlUiRenderer';

class HtmlUiRendererPlugin extends ProcessorPlugin {
  async load() {
    return new HtmlUiRenderer({});
  }
}

export default HtmlUiRendererPlugin;
