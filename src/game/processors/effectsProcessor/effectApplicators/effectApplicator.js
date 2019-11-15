class EffectApplicator {
  update() {
    throw new Error('You should override this function');
  }

  isFinished() {
    throw new Error('You should override this function');
  }

  cancel() {}
}

export default EffectApplicator;
