const STATE = {
  2: 'ENTER',
  1: 'STAY',
  0: 'LEAVE',
};

class Collision {
  constructor(entity1, entity2, mtv1, mtv2) {
    this._entity1 = entity1;
    this._entity2 = entity2;
    this._lifetime = 2;
    this._mtv1 = mtv1;
    this._mtv2 = mtv2;
  }

  set entity1(entity1) {
    this._entity1 = entity1;
  }

  get entity1() {
    return this._entity1;
  }

  set entity2(entity2) {
    this._entity2 = entity2;
  }

  get entity2() {
    return this._entity2;
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
