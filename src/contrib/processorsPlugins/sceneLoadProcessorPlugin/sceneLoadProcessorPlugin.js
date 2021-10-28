import ProcessorPlugin from '../../../engine/processorPlugin/processorPlugin';
import SceneLoadProcessor from '../../processors/sceneLoadProcessor/sceneLoadProcessor';

class SceneLoadProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const { sceneController } = options;

    return new SceneLoadProcessor({
      sceneController,
    });
  }
}

export default SceneLoadProcessorPlugin;
