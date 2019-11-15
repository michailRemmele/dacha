import EffectApplicator from './effectApplicator';

class DelayedEffectApplicator extends EffectApplicator {
  constructor(effect, options) {
    super();

    this._effect = effect;
    this._isFinished = false;
    this._timer = options.timer;
  }

  update(deltaTime) {
    if (this._isFinished) {
      return;
    }

    this._timer -= deltaTime;

    if (this._timer <= 0) {
      this._effect.apply();
      this._isFinished = true;
    }
  }

  isFinished() {
    return this._isFinished;
  }
}

export default DelayedEffectApplicator;
