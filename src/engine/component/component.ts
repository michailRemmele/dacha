import { GameObject } from '../gameObject';

const findParentComponent = (gameObject: GameObject, componentName: string): Component | void => {
  if (!gameObject.parent) {
    return void 0;
  }

  const parentComponent = gameObject.parent.getComponent(componentName);

  return parentComponent || findParentComponent(gameObject.parent, componentName);
};

export abstract class Component {
  private _componentName: string;
  private _gameObject?: GameObject;

  constructor(name: string) {
    this._componentName = name;
    this._gameObject = void 0;
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

  abstract clone(): Component;
}
