class Component {
  set parent(parent) {
    this._parent = parent;
  }

  get parent() {
    return this._parent;
  }

  clone() {
    throw new Error('You should override this function');
  }
}

export default Component;
