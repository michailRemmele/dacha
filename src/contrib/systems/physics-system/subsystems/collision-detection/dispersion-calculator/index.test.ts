import { DispersionCalculator } from '.';
import type { AABB } from '../types';

const createAABB = (minX: number, maxX: number, minY = 0, maxY = 0): AABB => ({
  min: { x: minX, y: minY },
  max: { x: maxX, y: maxY },
});

describe('PhysicsSystem -> collision-detection -> DispersionCalculator', () => {
  it('Returns zero dispersion for an empty sample', () => {
    const calculator = new DispersionCalculator('x');

    expect(calculator.getDispersion()).toBe(0);
  });

  it('Returns zero dispersion for a single item', () => {
    const calculator = new DispersionCalculator('x');

    calculator.addToSample(createAABB(1, 3));

    expect(calculator.getDispersion()).toBe(0);
  });

  it('Calculates dispersion from AABB centers on the configured axis', () => {
    const calculator = new DispersionCalculator('x');

    calculator.addToSample(createAABB(-1, 1));
    calculator.addToSample(createAABB(9, 11));

    expect(calculator.getDispersion()).toBeCloseTo(25);
  });

  it('Updates dispersion when items are removed', () => {
    const calculator = new DispersionCalculator('x');
    const first = createAABB(-1, 1);
    const second = createAABB(9, 11);
    const third = createAABB(19, 21);

    calculator.addToSample(first);
    calculator.addToSample(second);
    calculator.addToSample(third);
    calculator.removeFromSample(third);

    expect(calculator.getDispersion()).toBeCloseTo(25);
  });

  it('Resets internal sums when the last item is removed', () => {
    const calculator = new DispersionCalculator('x');
    const item = createAABB(1, 3);

    calculator.addToSample(item);
    calculator.removeFromSample(item);

    expect(calculator.getDispersion()).toBe(0);
  });

  it('Ignores removals from an empty sample', () => {
    const calculator = new DispersionCalculator('x');

    calculator.removeFromSample(createAABB(1, 3));

    expect(calculator.getDispersion()).toBe(0);
  });
});
