export const getGridFragmentShader = (): string => `
  precision mediump float;

  uniform vec2 u_graphic_resolution;
  uniform vec2 u_offset;
  uniform float u_camera_zoom;
  uniform float u_spacing;
  uniform vec4 u_line_color;

  void main() {
    float offX = u_camera_zoom * u_offset.x + gl_FragCoord.x - u_graphic_resolution.x;
    float offY = u_camera_zoom * u_offset.y + (1.0 - gl_FragCoord.y) + u_graphic_resolution.y;

    if (int(mod(offX, u_spacing * u_camera_zoom)) == 0 ||
        int(mod(offY, u_spacing * u_camera_zoom)) == 0) {
      gl_FragColor = u_line_color;
    }
  }
`;
