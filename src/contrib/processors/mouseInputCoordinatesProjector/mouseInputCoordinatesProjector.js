import Processor from 'engine/processor/processor';

const INPUT_MESSAGE = 'MOUSE_INPUT_EVENT_QUERY';

const CURRENT_CAMERA_NAME = 'currentCamera';
const CAMERA_COMPONENT_NAME = 'camera';
const TRANSFORM_COMPONENT_NAME = 'transform';

class MouseInputCoordinatesProjector extends Processor {
  constructor(options) {
    super();

    const { store } = options;

    this._store = store;
  }

  process(options) {
    const messageBus = options.messageBus;
    const currentCamera = this._store.get(CURRENT_CAMERA_NAME);
    const { windowSizeX, windowSizeY, zoom } = currentCamera.getComponent(CAMERA_COMPONENT_NAME);
    const windowCenterX = windowSizeX / 2;
    const windowCenterY = windowSizeY / 2;

    const {
      offsetX: cameraOffsetX,
      offsetY: cameraOffsetY,
    } = currentCamera.getComponent(TRANSFORM_COMPONENT_NAME);

    const messages = messageBus.get(INPUT_MESSAGE) || [];
    messages.forEach((message) => {
      message.query.forEach((inputEvent) => {
        inputEvent.screenX = inputEvent.x;
        inputEvent.screenY = inputEvent.y;
        inputEvent.x = ((inputEvent.x - windowCenterX) / zoom) + cameraOffsetX;
        inputEvent.y = ((inputEvent.y - windowCenterY) / zoom) + cameraOffsetY;
      });
    });
  }
}

export default MouseInputCoordinatesProjector;
