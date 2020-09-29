import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import ScriptProcessor from 'contrib/processors/scriptProcessor/scriptProcessor';

class ScriptProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      helpers,
      gameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
    } = options;
    const { scripts } = await helpers.loadScripts();

    return new ScriptProcessor({
      gameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
      scripts,
    });
  }
}

export default ScriptProcessorPlugin;
