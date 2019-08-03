import Processor from 'engine/processor/processor';

const CURRENT_CAMERA_NAME = 'currentCamera';
const SET_CAMERA_MESSAGE = 'SET_CAMERA';

class CameraProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._store = options.store;

    const currentCamera = this._gameObjectObserver.getById(options.initialCamera);

    if (!currentCamera) {
      throw new Error(`Could not set camera with id ${options.initialCamera} for the scene`);
    }

    this._store.set(CURRENT_CAMERA_NAME, currentCamera);
  }

  process(options) {
    const messageBus = options.messageBus;

    const messages = messageBus.get(SET_CAMERA_MESSAGE);
    if (messages) {
      const { gameObjectId } = messages[messages.length - 1];
      const currentCamera = this._gameObjectObserver.getById(gameObjectId);

      if (!currentCamera) {
        throw new Error(`Could not set camera with id ${gameObjectId} for the scene`);
      }

      this._store.set(CURRENT_CAMERA_NAME, currentCamera);
    }
  }
}

export default CameraProcessor;
