import { Interpolation } from '../index';

describe('Interpolation', () => {
  it('applies config defaults', () => {
    const interpolation = new Interpolation({});

    expect(interpolation.mode).toBe('interpolate');
    expect(interpolation.snapThreshold).toBe(0);
    expect(interpolation.disabled).toBe(false);
    expect(interpolation._initialized).toBe(false);
    expect(interpolation._snapRequested).toBe(false);
  });

  it('applies provided config values', () => {
    const interpolation = new Interpolation({
      mode: 'extrapolate',
      snapThreshold: 5,
      disabled: true,
    });

    expect(interpolation.mode).toBe('extrapolate');
    expect(interpolation.snapThreshold).toBe(5);
    expect(interpolation.disabled).toBe(true);
  });

  it('marks a snap request', () => {
    const interpolation = new Interpolation({});

    interpolation.snap();

    expect(interpolation._snapRequested).toBe(true);
  });
});
