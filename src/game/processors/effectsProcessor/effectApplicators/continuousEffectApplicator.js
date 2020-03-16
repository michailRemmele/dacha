import EffectApplicator from './effectApplicator';

class ContinuousEffectApplicator extends EffectApplicator {
  constructor(effect) {
    super();

    this._effect = effect;

    this._isApplied = false;
  }

  update() {
    if (this._isApplied) {
      return;
    }

    this._effect.apply();
    this._isApplied = true;
  }

  cancel() {
    if (!this._isApplied) {
      return;
    }

    this._effect.onCancel();
  }

  isFinished() {
    return false;
  }
}

export default ContinuousEffectApplicator;
