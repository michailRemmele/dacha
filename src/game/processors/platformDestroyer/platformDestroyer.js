import Processor from 'engine/processor/processor';

const PLATFORM_CHANGE_MSG = 'PLATFORM_CHANGE';
const ADD_EFFECT_MSG = 'ADD_EFFECT';

const PLATFORM_STORE_KEY = 'platform';

const DESTRUCTION_EFFECT = {
  name: 'platformDestruction',
  effect: 'damage',
  effectType: 'periodical',
  applicatorOptions: {
    frequency: 5000,
  },
  effectOptions: {
    value: 1,
  },
};

class PlatformDestroyer extends Processor {
  constructor(options) {
    super();

    this._store = options.store;

    this._platformEdge = null;
  }

  _updatePlatformEdge() {
    this._platformEdge = [];

    const platform = this._store.get(PLATFORM_STORE_KEY);

    if (!platform || !platform.length) {
      return;
    }

    this._platformEdge = this._platformEdge.concat(platform[0]);

    if (platform.length === 1) {
      return;
    }

    this._platformEdge = this._platformEdge.concat(platform[platform.length - 1]);

    if (platform.length === 2) {
      return;
    }

    for (let i = 1; i < platform.length - 1; i++) {
      const platformRow = platform[i];

      this._platformEdge.push(platformRow[0]);
      this._platformEdge.push(platformRow[platformRow.length - 1]);
    }
  }

  _startDestruction(messageBus) {
    this._platformEdge.forEach((platformBlock) => {
      messageBus.send({
        type: ADD_EFFECT_MSG,
        id: platformBlock.getId(),
        gameObject: platformBlock,
        ...DESTRUCTION_EFFECT,
      });
    });
  }

  process(options) {
    const { messageBus } = options;

    const messages = messageBus.get(PLATFORM_CHANGE_MSG);
    if (!this._platformEdge || messages) {
      this._updatePlatformEdge();
      this._startDestruction(messageBus);
    }
  }
}

export default PlatformDestroyer;
