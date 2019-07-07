import IntersectionChecker from './intersectionChecker';

class BoxesIntersectionChecker extends IntersectionChecker {
  /*
   * TODO:: Improve this method when boxes will get rotation property
   */
  check() {
    return true;
  }
}

export default BoxesIntersectionChecker;
