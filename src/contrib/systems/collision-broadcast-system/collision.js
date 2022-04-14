const STATE = {
  2: 'ENTER',
  1: 'STAY',
  0: 'LEAVE',
};

class Collision {
  constructor(gameObject1, gameObject2, mtv1, mtv2) {
    this._gameObject1 = gameObject1;
    this._gameObject2 = gameObject2;
    this._lifetime = 2;
    this._mtv1 = mtv1;
    this._mtv2 = mtv2;
  }

  set gameObject1(gameObject1) {
    this._gameObject1 = gameObject1;
  }

  get gameObject1() {
    return this._gameObject1;
  }

  set gameObject2(gameObject2) {
    this._gameObject2 = gameObject2;
  }

  get gameObject2() {
    return this._gameObject2;
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
