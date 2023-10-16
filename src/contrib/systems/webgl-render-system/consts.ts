export const MAX_COLOR_NUMBER = 255;
export const DRAW_OFFSET = 0;
export const DRAW_COUNT = 6;
export const STD_SCREEN_SIZE = 1080;

export const VECTOR_2_SIZE = 2;
export const BYTES_PER_VECTOR_2 = Float32Array.BYTES_PER_ELEMENT * VECTOR_2_SIZE;

export const VERTEX_STRIDE = VECTOR_2_SIZE * 2;
export const VERTEX_DATA_STRIDE = VERTEX_STRIDE * DRAW_COUNT;

export const BUFFER_SIZE = VERTEX_DATA_STRIDE * Float32Array.BYTES_PER_ELEMENT;

export const CURRENT_CAMERA_NAME = 'currentCamera';
