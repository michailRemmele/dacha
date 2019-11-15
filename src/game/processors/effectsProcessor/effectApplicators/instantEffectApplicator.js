import EffectApplicator from './effectApplicator';

class InstantEffectApplicator extends EffectApplicator {
  constructor(effect) {
    super();

    this._effect = effect;
    this._isFinished = false;
  }

  update() {
    if (this._isFinished) {
      return;
    }

    this._effect.apply();
    this._isFinished = true;
  }

  isFinished() {
    return this._isFinished;
  }
}

export default InstantEffectApplicator;
