const STATE = {
  2: 'ENTER',
  1: 'STAY',
  0: 'LEAVE',
};

class Collision {
  constructor(gameObject, otherGameObject, mtv1, mtv2) {
    this._gameObject = gameObject;
    this._otherGameObject = otherGameObject;
    this._lifetime = 2;
    this._mtv1 = mtv1;
    this._mtv2 = mtv2;
  }

  set gameObject(gameObject) {
    this._gameObject = gameObject;
  }

  get gameObject() {
    return this._gameObject;
  }

  set otherGameObject(otherGameObject) {
    this._otherGameObject = otherGameObject;
  }

  get otherGameObject() {
    return this._otherGameObject;
  }

  set mtv1(mtv1) {
    this._mtv1 = mtv1;
  }

  get mtv1() {
    return this._mtv1;
  }

  set mtv2(mtv2) {
    this._mtv2 = mtv2;
  }

  get mtv2() {
    return this._mtv2;
  }

  isFinished() {
    return this._lifetime < 0;
  }

  signal() {
    this._lifetime = 1;
  }

  tick() {
    this._lifetime -= this._lifetime || 1;
  }

  getState() {
    return STATE[this._lifetime];
  }
}

export default Collision;
