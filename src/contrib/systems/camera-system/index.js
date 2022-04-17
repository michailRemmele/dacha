const CURRENT_CAMERA_NAME = 'currentCamera';
const SET_CAMERA_MESSAGE = 'SET_CAMERA';

const CAMERA_COMPONENT_NAME = 'camera';

export class CameraSystem {
  constructor(options) {
    const {
      store, entityObserver, window, initialCamera, messageBus,
    } = options;

    this._entityObserver = entityObserver;
    this.messageBus = messageBus;
    this._store = store;
    this._window = window;

    const currentCamera = this._entityObserver.getById(initialCamera);

    if (!currentCamera) {
      throw new Error(`Could not set camera with id ${initialCamera} for the scene`);
    }

    this._setCamera(currentCamera);
  }

  systemDidMount() {
    this._updateCameraWindowSize();
    window.addEventListener('resize', this._updateCameraWindowSize);
  }

  systemWillUnmount() {
    window.removeEventListener('resize', this._updateCameraWindowSize);
  }

  _updateCameraWindowSize = () => {
    const camera = this._store.get(CURRENT_CAMERA_NAME);

    const width = this._window.innerWidth || this._window.clientWidth;
    const height = this._window.innerHeight || this._window.clientHeight;

    const cameraComponent = camera.getComponent(CAMERA_COMPONENT_NAME);
    const { windowSizeX, windowSizeY } = cameraComponent;

    if (width !== windowSizeX || height !== windowSizeY) {
      cameraComponent.windowSizeX = width;
      cameraComponent.windowSizeY = height;
    }
  }

  _setCamera(camera) {
    this._store.set(CURRENT_CAMERA_NAME, camera);
    this._updateCameraWindowSize();
  }

  update() {
    const messages = this.messageBus.get(SET_CAMERA_MESSAGE);
    if (messages) {
      const { entityId } = messages[messages.length - 1];
      const newCamera = this._entityObserver.getById(entityId);

      if (!newCamera) {
        throw new Error(`Could not set camera with id ${entityId} for the scene`);
      }

      this._setCamera(newCamera);
    }
  }
}
