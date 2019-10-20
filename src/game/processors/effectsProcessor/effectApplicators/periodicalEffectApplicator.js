import EffectApplicator from './effectApplicator';

class PeriodicalEffectApplicator extends EffectApplicator {
  constructor(effect, options) {
    super();

    this._effect = effect;
    this._isFinished = false;
    this._frequency = options.frequency;
    this._duration = options.duration;

    this._cooldown = this._frequency;
  }

  update(deltaTime) {
    if (this._isFinished) {
      return;
    }

    this._cooldown -= deltaTime;

    while (this._cooldown <= 0) {
      this._effect.apply();
      this._cooldown += this._frequency;
    }

    if (this._duration) {
      this._duration -= deltaTime;
      if (this._duration <= 0) {
        this._isFinished = true;
      }
    }
  }

  isFinished() {
    return this._isFinished;
  }
}

export default PeriodicalEffectApplicator;
