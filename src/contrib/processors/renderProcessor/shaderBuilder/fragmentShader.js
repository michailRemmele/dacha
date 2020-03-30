const fragmentShader = `
precision highp float;

uniform sampler2D u_image;
// uniform vec2 u_textureAtlasSize;
// uniform vec2 u_texCoordTranslation;
// uniform vec2 u_textureSize;

varying vec2 v_position;
varying vec2 v_texCoord;

void main() {
  // vec2 texCoord = vec2(
  //   mod(v_position.x, u_textureSize.x),
  //   mod(v_position.y, u_textureSize.y)
  // );
  
  // texCoord = texCoord + u_texCoordTranslation;
  // texCoord = texCoord / u_textureAtlasSize;

  // gl_FragColor = texture2D(u_image, texCoord);
  gl_FragColor = texture2D(u_image, v_texCoord);
}
`;

export default fragmentShader;
