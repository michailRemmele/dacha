import { formatTime } from '../utils';

describe('formatTime', () => {
  it('formats zero', () => {
    expect(formatTime(0)).toBe('0:00');
  });

  it('pads seconds and drops the fraction', () => {
    expect(formatTime(65.4)).toBe('1:05');
  });

  it('keeps minutes above nine', () => {
    expect(formatTime(600)).toBe('10:00');
  });

  it('treats a value that is not finite as zero', () => {
    expect(formatTime(NaN)).toBe('0:00');
    expect(formatTime(Infinity)).toBe('0:00');
  });

  it('shows tenths when asked, so short sounds are not 0:00', () => {
    expect(formatTime(0.127, true)).toBe('0:00.1');
    expect(formatTime(1.25, true)).toBe('0:01.2');
    expect(formatTime(0, true)).toBe('0:00.0');
  });
});
