class Effect {
  apply() {
    throw new Error('You should override this function');
  }

  onCancel() {}
}

export default Effect;
