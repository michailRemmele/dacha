import { Rectangle } from '../rectangle';

describe('Contrib -> RenderProcessor -> geometry -> Rectangle', () => {
  it('Returns correct array of vertices', () => {
    const rectangle = new Rectangle(10, 20);

    expect(rectangle.toArray()).toEqual([
      0, 0,
      10, 0,
      0, 20,
      0, 20,
      10, 0,
      10, 20,
    ]);
  });
});
