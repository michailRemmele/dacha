import Processor from 'engine/processor/processor';

const MOVEMENT_MESSAGE_TYPE = 'MOVEMENT';

const CONTROLLABLE_COMPONENT_NAME = 'controllable';

class ControlProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
  }

  getComponentList() {
    return [
      CONTROLLABLE_COMPONENT_NAME,
    ];
  }

  _validateGameObject(gameObject) {
    return this.getComponentList().every((component) => {
      return !!gameObject.getComponent(component);
    });
  }

  process(options) {
    const messageBus = options.messageBus;

    this._gameObjectObserver.forEach((gameObject) => {
      if (!this._validateGameObject(gameObject))  {
        return;
      }

      const controllable = gameObject.getComponent(CONTROLLABLE_COMPONENT_NAME);

      const actions = Object.keys(controllable.actions).reduce((storage, inputEvent) => {
        if (messageBus.get(inputEvent)) {
          storage.push(controllable.actions[inputEvent]);
        }
        return storage;
      }, []);

      if (actions.length) {
        messageBus.send({
          type: MOVEMENT_MESSAGE_TYPE,
          gameObject: gameObject,
          actions: actions,
        });
      }
    });
  }
}

export default ControlProcessor;
