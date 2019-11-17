import Processor from 'engine/processor/processor';

const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const TRANSFORM_COMPONENT_NAME = 'transform';
const PLATFORM_SIZE_NAME = 'platformSize';

class PlatformSizeMeter extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._store = options.store;

    this._platformCount = 0;
  }

  _sortPlatforms() {
    this._gameObjectObserver.sort((a, b) => {
      const aTransform = a.getComponent(TRANSFORM_COMPONENT_NAME);
      const bTransform = b.getComponent(TRANSFORM_COMPONENT_NAME);

      if (aTransform.offsetY > bTransform.offsetY) {
        return 1;
      }

      if (aTransform.offsetY < bTransform.offsetY) {
        return -1;
      }

      if (aTransform.offsetX > bTransform.offsetX) {
        return 1;
      }

      if (aTransform.offsetX < bTransform.offsetX) {
        return -1;
      }

      return 0;
    });
  }

  _calculatePlatformSize() {
    this._platformCount = this._gameObjectObserver.size();

    if (!this._platformCount) {
      return;
    }

    this._sortPlatforms();

    const first = this._gameObjectObserver.getByIndex(0);
    const { collider: firstCollider } = first.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME);
    const firstTransform = first.getComponent(TRANSFORM_COMPONENT_NAME);

    const last = this._gameObjectObserver.getByIndex(this._platformCount - 1);
    const { collider: lastCollider } = last.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME);
    const lastTransform = last.getComponent(TRANSFORM_COMPONENT_NAME);

    const minX = -(firstCollider.sizeX / 2) + (firstCollider.centerX + firstTransform.offsetX);
    const minY = -(firstCollider.sizeY / 2) + (firstCollider.centerY + firstTransform.offsetY);
    const maxX = (lastCollider.sizeX / 2) + (lastCollider.centerX + lastTransform.offsetX);
    const maxY = (lastCollider.sizeY / 2) + (lastCollider.centerY + lastTransform.offsetY);

    this._store.set(PLATFORM_SIZE_NAME, {
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
    if (this._platformCount !== this._gameObjectObserver.size()) {
      this._calculatePlatformSize();
    }
  }
}

export default PlatformSizeMeter;
