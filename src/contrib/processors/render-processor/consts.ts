export const MAX_COLOR_NUMBER = 255;
export const DRAW_OFFSET = 0;
export const DRAW_COUNT = 6;
export const STD_SCREEN_SIZE = 1080;

export const VECTOR_2_SIZE = 2;
export const BYTES_PER_VECTOR_2 = Float32Array.BYTES_PER_ELEMENT * VECTOR_2_SIZE;
export const MATRIX_ROW_SIZE = 3;
export const MATRIX_COLUMN_SIZE = 3;
export const MATRIX_SIZE = MATRIX_ROW_SIZE * MATRIX_COLUMN_SIZE;
export const BYTES_PER_MATRIX = Float32Array.BYTES_PER_ELEMENT * MATRIX_SIZE;
export const BYTES_PER_MATRIX_ROW = Float32Array.BYTES_PER_ELEMENT * MATRIX_ROW_SIZE;

export const VERTEX_STRIDE = (VECTOR_2_SIZE * 5) + (MATRIX_SIZE);
export const VERTEX_DATA_STRIDE = VERTEX_STRIDE * DRAW_COUNT;

export const BUFFER_SIZE = 1000 * VERTEX_DATA_STRIDE * Float32Array.BYTES_PER_ELEMENT;

export const RENDERABLE_COMPONENT_NAME = 'renderable';
export const TRANSFORM_COMPONENT_NAME = 'transform';
export const CAMERA_COMPONENT_NAME = 'camera';
export const CURRENT_CAMERA_NAME = 'currentCamera';
