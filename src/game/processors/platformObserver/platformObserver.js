import Processor from 'engine/processor/processor';

const COLLIDER_COMPONENT_NAME = 'colliderContainer';
const TRANSFORM_COMPONENT_NAME = 'transform';

const PLATFORM_CHANGE_MSG = 'PLATFORM_CHANGE';

const PLATFORM_STORE_KEY = 'platform';

class PlatformObserver extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._store = options.store;

    this._blocksCount = 0;
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

  _updatePlatform() {
    if (!this._gameObjectObserver.size() || this._blocksCount === this._gameObjectObserver.size()) {
      return false;
    }

    this._blocksCount = this._gameObjectObserver.size();

    const platform = [];

    this._sortPlatforms();

    let rowIndex = 0;
    let lastOffsetY;

    for (let i = 0; i < this._blocksCount; i++) {
      const block = this._gameObjectObserver.getByIndex(i);
      const { offsetY } = block.getComponent(TRANSFORM_COMPONENT_NAME);
      const { collider: { centerY }} = block.getComponent(COLLIDER_COMPONENT_NAME);
      const currentOffsetY = offsetY + centerY;

      if (lastOffsetY && currentOffsetY !== lastOffsetY) {
        rowIndex += 1;
      }

      platform[rowIndex] = platform[rowIndex] || [];
      platform[rowIndex].push(block);
      lastOffsetY = currentOffsetY;
    }

    this._store.set(PLATFORM_STORE_KEY, platform);

    return true;
  }

  processorDidMount() {
    this._updatePlatform();
  }

  process(options) {
    const { messageBus } = options;

    if (this._updatePlatform()) {
      messageBus.send({
        type: PLATFORM_CHANGE_MSG,
      });
    }
  }
}

export default PlatformObserver;
