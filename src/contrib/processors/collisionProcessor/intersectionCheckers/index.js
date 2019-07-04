import BoxesIntersectionChecker from './boxesIntersectionChecker';
import CirclesIntersectionChecker from './circlesIntersectionChecker';
import BoxAndCircleIntersectionChecker from './boxAndCircleIntersectionChecker';

export default {
  boxCollider_boxCollider: BoxesIntersectionChecker,
  circleCollider_circleCollider: CirclesIntersectionChecker,
  circleCollider_boxCollider: BoxAndCircleIntersectionChecker,
  boxCollider_circleCollider: BoxAndCircleIntersectionChecker,
};
