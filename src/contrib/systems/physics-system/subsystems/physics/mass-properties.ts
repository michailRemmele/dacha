import type { Collider, Transform } from '../../../../components';

const getOffsetInertia = (
  mass: number,
  offsetX: number,
  offsetY: number,
): number => {
  return mass * (offsetX * offsetX + offsetY * offsetY);
};

export const calculateInertia = (
  mass: number,
  collider: Collider | undefined,
  transform: Transform,
): number => {
  if (mass <= 0 || !collider || collider.disabled) {
    return 0;
  }

  const scaleX = Math.abs(transform.world.scale.x);
  const scaleY = Math.abs(transform.world.scale.y);
  const offsetX = collider.offset.x * scaleX;
  const offsetY = collider.offset.y * scaleY;
  let inertia = 0;

  switch (collider.shape.type) {
    case 'circle': {
      const radius = collider.shape.radius * Math.max(scaleX, scaleY);

      if (radius <= 0) {
        return 0;
      }

      inertia = 0.5 * mass * radius * radius;
      break;
    }
    case 'box': {
      const width = collider.shape.size.x * scaleX;
      const height = collider.shape.size.y * scaleY;

      if (width <= 0 || height <= 0) {
        return 0;
      }

      inertia = (mass * (width * width + height * height)) / 12;
      break;
    }
    case 'capsule': {
      const radius = collider.shape.radius * Math.max(scaleX, scaleY);
      const width = radius * 2;
      const height = collider.shape.height * scaleY + width;

      if (radius <= 0 || height <= 0) {
        return 0;
      }

      inertia = (mass * (width * width + height * height)) / 12;
      break;
    }
    case 'segment': {
      const point1 = collider.shape.point1;
      const point2 = collider.shape.point2;
      const dx = (point2.x - point1.x) * scaleX;
      const dy = (point2.y - point1.y) * scaleY;
      const length = Math.sqrt(dx * dx + dy * dy);

      if (length <= 0) {
        return 0;
      }

      inertia = (mass * (length * length + 1)) / 12;
      break;
    }
  }

  return inertia + getOffsetInertia(mass, offsetX, offsetY);
};
