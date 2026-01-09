/**
 * SVG Utilities for custom chart components
 * Provides functions for generating SVG paths and shapes
 */

/**
 * Convert polar coordinates to Cartesian coordinates
 */
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

/**
 * Generate SVG path for an arc
 * Used for semicircular gauges and progress indicators
 *
 * @param cx - Center X coordinate
 * @param cy - Center Y coordinate
 * @param radius - Arc radius
 * @param startAngle - Start angle in degrees (0-360)
 * @param endAngle - End angle in degrees (0-360)
 * @returns SVG path string
 *
 * @example
 * // Create a semicircle (180 degrees)
 * const path = describeArc(100, 100, 80, 0, 180);
 * // Returns: "M 20 100 A 80 80 0 0 1 180 100"
 */
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y
  ].join(' ');

  return d;
}

/**
 * Calculate angle for a value within a range
 * Used to position gauge needles
 *
 * @param value - Current value
 * @param min - Minimum value in range
 * @param max - Maximum value in range
 * @param minAngle - Minimum angle (default: 0)
 * @param maxAngle - Maximum angle (default: 180)
 * @returns Angle in degrees
 *
 * @example
 * // Value at 50% of range
 * const angle = valueToAngle(50, 0, 100); // Returns: 90
 */
export function valueToAngle(
  value: number,
  min: number,
  max: number,
  minAngle: number = 0,
  maxAngle: number = 180
): number {
  // Clamp value within range
  const clampedValue = Math.max(min, Math.min(max, value));

  // Calculate percentage
  const percentage = (clampedValue - min) / (max - min);

  // Convert to angle
  const angle = minAngle + percentage * (maxAngle - minAngle);

  return angle;
}

/**
 * Generate SVG path for a rounded rectangle
 * Used for custom chart bars and cards
 */
export function roundedRect(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): string {
  return `
    M ${x + radius} ${y}
    L ${x + width - radius} ${y}
    Q ${x + width} ${y} ${x + width} ${y + radius}
    L ${x + width} ${y + height - radius}
    Q ${x + width} ${y + height} ${x + width - radius} ${y + height}
    L ${x + radius} ${y + height}
    Q ${x} ${y + height} ${x} ${y + height - radius}
    L ${x} ${y + radius}
    Q ${x} ${y} ${x + radius} ${y}
    Z
  `;
}
