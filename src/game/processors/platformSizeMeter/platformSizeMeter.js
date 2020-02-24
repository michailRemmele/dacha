import Processor from 'engine/processor/processor';

const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const TRANSFORM_COMPONENT_NAME = 'transform';

const PLATFORM_CHANGE_MSG = 'PLATFORM_CHANGE';

const PLATFORM_STORE_KEY = 'platform';
const PLATFORM_SIZE_STORE_KEY = 'platformSize';

class PlatformSizeMeter extends Processor {
  constructor(options) {
    super();

    this._store = options.store;
  }

  _calculatePlatformSize() {
    const platform = this._store.get(PLATFORM_STORE_KEY);

    if (!platform || !platform.length) {
      return;
    }

    const first = platform[0][0];
    const { collider: firstCollider } = first.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME);
    const firstTransform = first.getComponent(TRANSFORM_COMPONENT_NAME);

    const lastRow = platform[platform.length - 1];
    const last = lastRow[lastRow.length - 1];
    const { collider: lastCollider } = last.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME);
    const lastTransform = last.getComponent(TRANSFORM_COMPONENT_NAME);

    const minX = -(firstCollider.sizeX / 2) + (firstCollider.centerX + firstTransform.offsetX);
    const minY = -(firstCollider.sizeY / 2) + (firstCollider.centerY + firstTransform.offsetY);
    const maxX = (lastCollider.sizeX / 2) + (lastCollider.centerX + lastTransform.offsetX);
    const maxY = (lastCollider.sizeY / 2) + (lastCollider.centerY + lastTransform.offsetY);

    this._store.set(PLATFORM_SIZE_STORE_KEY, {
      minX: minX,
      maxX: maxX,
      minY: minY,
      maxY: maxY,
    });
  }

  processorDidMount() {
    this._calculatePlatformSize();
  }

  process(options) {
    const { messageBus } = options;

    const messages = messageBus.get(PLATFORM_CHANGE_MSG);
    if (messages) {
      this._calculatePlatformSize();
    }
  }
}

export default PlatformSizeMeter;
