import { MIN_ZOOM, MAX_ZOOM } from './consts';

const roundZoom = (value: number): number => parseFloat(value.toFixed(4));

export const updateZoom = (zoom: number, factor: number): number => {
  return Math.min(Math.max(MIN_ZOOM, roundZoom(zoom * factor)), MAX_ZOOM);
};
