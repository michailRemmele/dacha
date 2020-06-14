import IntersectionChecker from './intersectionChecker';
import SAT from './sat';

class BoxesIntersectionChecker extends IntersectionChecker {
  constructor() {
    super();
    this.sat = new SAT();
  }

  /*
   * TODO:: Improve this method when boxes will get rotation property
   */
  check(arg1, arg2) {
    return this.sat.checkIntersectAxisAlignedBoxes(arg1.coordinates, arg2.coordinates);
  }
}

export default BoxesIntersectionChecker;
