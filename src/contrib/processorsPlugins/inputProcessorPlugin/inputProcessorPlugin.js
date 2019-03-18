import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';
import IOC from 'engine/ioc/ioc';
import { RESOURCES_LOADER_KEY_NAME } from 'engine/consts/global';

import InputProcessor from 'contrib/processors/inputProcessor/inputProcessor';

class InputProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const actionList = options.actionList;
    const resourceLoader = IOC.resolve(RESOURCES_LOADER_KEY_NAME);

    const actions = await Promise.all(actionList.map((actionInfo) => {
      return resourceLoader.load(actionInfo.src)
        .then((action) => {
          return {
            action: action,
            args: actionInfo.args,
            key: actionInfo.key,
          };
        });
    }));

    return new InputProcessor(actions);
  }
}

export default InputProcessorPlugin;
