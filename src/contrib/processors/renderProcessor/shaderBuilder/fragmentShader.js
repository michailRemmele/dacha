const fragmentShader = `
precision highp float;

uniform sampler2D u_image;

varying vec2 v_texCoord;
varying vec2 v_texCoordTranslation;
varying vec2 v_textureAtlasSize;
varying vec2 v_textureSize;
varying vec2 v_quadSize;

void main() {
  vec2 texCoord = v_texCoord;
  
  texCoord = vec2(
    mod(v_texCoord.x * v_quadSize.x / v_textureSize.x, v_textureSize.x),
    mod(v_texCoord.y * v_quadSize.y / v_textureSize.y, v_textureSize.y)
  );
  
  texCoord = texCoord + v_texCoordTranslation;
  texCoord = texCoord / v_textureAtlasSize;

  gl_FragColor = texture2D(u_image, texCoord);
}
`;

export default fragmentShader;
