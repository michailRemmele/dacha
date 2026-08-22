export const getGridFragmentShader = (): string => `
  precision mediump float;

  uniform vec2 u_graphic_resolution;
  uniform vec2 u_offset;
  uniform float u_camera_zoom;
  uniform float u_spacing;
  uniform vec4 u_line_color;

  const float MAJOR_INTERVAL = 8.0;
  const float MINOR_INTENSITY = 0.35;
  const float MINOR_FADE_IN_PX = 4.0;
  const float MINOR_FADE_OUT_PX = 10.0;
  const float MAJOR_FADE_IN_PX = 1.5;
  const float MAJOR_FADE_OUT_PX = 4.0;

  const vec2 AA_WIDTH = vec2(1.0);

  float gridLineFactor(vec2 coord, float spacing) {
    vec2 distToLine = abs(fract(coord / spacing - 0.5) - 0.5) * spacing;
    vec2 lineFactor = 1.0 - smoothstep(vec2(0.0), AA_WIDTH, distToLine);
    return max(lineFactor.x, lineFactor.y);
  }

  void main() {
    vec2 coord = vec2(
      u_camera_zoom * u_offset.x + gl_FragCoord.x - u_graphic_resolution.x,
      u_camera_zoom * u_offset.y + (1.0 - gl_FragCoord.y) + u_graphic_resolution.y
    );

    float minorSpacing = u_spacing * u_camera_zoom;
    float majorSpacing = minorSpacing * MAJOR_INTERVAL;

    float minorFade = smoothstep(MINOR_FADE_IN_PX, MINOR_FADE_OUT_PX, minorSpacing);
    float majorFade = smoothstep(MAJOR_FADE_IN_PX, MAJOR_FADE_OUT_PX, majorSpacing);

    float minorLine = gridLineFactor(coord, minorSpacing) * minorFade * MINOR_INTENSITY;
    float majorLine = gridLineFactor(coord, majorSpacing) * majorFade;

    float alpha = max(minorLine, majorLine) * u_line_color.a;

    gl_FragColor = vec4(u_line_color.rgb * alpha, alpha);
  }
`;
