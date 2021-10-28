import Processor from '../../../engine/processor/processor';

const CURRENT_CAMERA_NAME = 'currentCamera';
const SET_CAMERA_MESSAGE = 'SET_CAMERA';

const CAMERA_COMPONENT_NAME = 'camera';

class CameraProcessor extends Processor {
  constructor(options) {
    super();

    const {
      store, gameObjectObserver, window, initialCamera,
    } = options;

    this._gameObjectObserver = gameObjectObserver;
    this._store = store;
    this._window = window;

    const currentCamera = this._gameObjectObserver.getById(initialCamera);

    if (!currentCamera) {
      throw new Error(`Could not set camera with id ${initialCamera} for the scene`);
    }

    this._setCamera(currentCamera);
  }

  _updateCameraWindowSize(camera) {
    const cameraComponent = camera.getComponent(CAMERA_COMPONENT_NAME);
    const { windowSizeX, windowSizeY } = cameraComponent;
    const currentWindowSizeX = this._window.width / window.devicePixelRatio;
    const currentWindowSizeY = this._window.height / window.devicePixelRatio;

    if (currentWindowSizeX !== windowSizeX || currentWindowSizeY !== windowSizeY) {
      cameraComponent.windowSizeX = currentWindowSizeX;
      cameraComponent.windowSizeY = currentWindowSizeY;
    }
  }

  _setCamera(camera) {
    this._updateCameraWindowSize(camera);
    this._store.set(CURRENT_CAMERA_NAME, camera);
  }

  process(options) {
    const { messageBus } = options;

    const messages = messageBus.get(SET_CAMERA_MESSAGE);
    if (messages) {
      const { gameObjectId } = messages[messages.length - 1];
      const newCamera = this._gameObjectObserver.getById(gameObjectId);

      if (!newCamera) {
        throw new Error(`Could not set camera with id ${gameObjectId} for the scene`);
      }

      this._setCamera(newCamera);
    }

    this._updateCameraWindowSize(this._store.get(CURRENT_CAMERA_NAME));
  }
}

export default CameraProcessor;
