import { type ViewContainer } from 'pixi.js';

import { composeSort } from '../index';

describe('Contrib -> Renderer -> Sort -> composeSort()', () => {
  const sortY = (a: ViewContainer, b: ViewContainer): number =>
    a.position.y - b.position.y;
  const sortX = (a: ViewContainer, b: ViewContainer): number =>
    a.position.x - b.position.x;

  it('Correctly creates composed sort function which executes passing function in correct order', () => {
    const view1 = { position: { x: 20, y: 10 } } as ViewContainer;
    const view2 = { position: { x: 30, y: 10 } } as ViewContainer;

    expect(composeSort([sortY, sortX])(view1, view2)).toBeLessThan(0);

    view1.position.y = 20;

    expect(composeSort([sortY, sortX])(view1, view2)).toBeGreaterThan(0);
  });
});
