const findParentComponent = (gameObject, componentName) => {
  if (!gameObject.parent) {
    return void 0;
  }

  const parentComponent = gameObject.parent.getComponent(componentName);

  return parentComponent || findParentComponent(gameObject.parent, componentName);
};

class Component {
  constructor(name) {
    this._componentName = name;
  }

  set componentName(name) {
    this._componentName = name;
  }

  get componentName() {
    return this._componentName;
  }

  set gameObject(gameObject) {
    this._gameObject = gameObject;
  }

  get gameObject() {
    return this._gameObject;
  }

  getParentComponent() {
    if (!this.gameObject) {
      return void 0;
    }

    return findParentComponent(this.gameObject, this.componentName);
  }

  clone() {
    throw new Error('You should override this function');
  }
}

export default Component;
