import { CharacterBody } from '../index';

describe('Contrib -> components -> CharacterBody', () => {
  it('Converts max slope angle config from degrees to radians', () => {
    const body = new CharacterBody({
      maxSlopeAngle: 60,
    });

    expect(body.maxSlopeAngle).toBeCloseTo(Math.PI / 3);
  });
});
