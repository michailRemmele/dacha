const findParentComponent = (gameObject, componentName) => {
  const parentGameObject = gameObject.getParent();
  
  if (!parentGameObject) {
    return;
  }

  const parentComponent = parentGameObject.getComponent(componentName);

  return parentComponent ? parentComponent : findParentComponent(parentGameObject, componentName);
}

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
      return;
    }

    return findParentComponent(this.gameObject, this.name);
  }

  clone() {
    throw new Error('You should override this function');
  }
}

export default Component;
