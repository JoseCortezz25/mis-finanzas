/**
 * Statistical utilities for calculating percentiles and distributions
 * Used for heatmap color intensity calculations
 */

/**
 * Calculate percentile value from a sorted array
 *
 * @param sortedArray - Array of numbers sorted in ascending order
 * @param percentile - Percentile to calculate (0-100)
 * @returns Value at the given percentile
 *
 * @example
 * const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * getPercentile(data, 50) // Returns: 5.5 (median)
 * getPercentile(data, 75) // Returns: 7.75
 */
export function getPercentile(
  sortedArray: number[],
  percentile: number
): number {
  if (sortedArray.length === 0) return 0;
  if (sortedArray.length === 1) return sortedArray[0];

  const index = (percentile / 100) * (sortedArray.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;

  if (lower === upper) {
    return sortedArray[lower];
  }

  return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
}

/**
 * Calculate multiple percentiles at once
 *
 * @param values - Array of numbers (will be sorted internally)
 * @param percentiles - Array of percentiles to calculate
 * @returns Object with percentile values
 *
 * @example
 * const data = [1, 5, 3, 8, 2, 9, 4, 7, 6, 10];
 * getPercentiles(data, [25, 50, 75])
 * // Returns: { 25: 3.25, 50: 5.5, 75: 7.75 }
 */
export function getPercentiles(
  values: number[],
  percentiles: number[]
): Record<number, number> {
  const sorted = [...values].sort((a, b) => a - b);
  const result: Record<number, number> = {};

  for (const p of percentiles) {
    result[p] = getPercentile(sorted, p);
  }

  return result;
}

/**
 * Map value to intensity level based on percentiles
 * Used for heatmap color levels (0-4)
 *
 * @param value - Value to map
 * @param percentiles - Percentile thresholds
 * @returns Intensity level (0-4)
 *
 * @example
 * const thresholds = { 25: 1000, 50: 2000, 75: 3000 };
 * mapValueToLevel(500, thresholds)  // Returns: 0 (very low)
 * mapValueToLevel(1500, thresholds) // Returns: 1 (low)
 * mapValueToLevel(2500, thresholds) // Returns: 2 (medium)
 * mapValueToLevel(3500, thresholds) // Returns: 3 (high)
 * mapValueToLevel(5000, thresholds) // Returns: 4 (very high)
 */
export function mapValueToLevel(
  value: number,
  percentiles: {
    25: number;
    50: number;
    75: number;
  }
): 0 | 1 | 2 | 3 | 4 {
  if (value === 0) return 0;
  if (value <= percentiles[25]) return 1;
  if (value <= percentiles[50]) return 2;
  if (value <= percentiles[75]) return 3;
  return 4;
}

/**
 * Calculate color levels for an array of values
 * Returns values with their corresponding intensity levels
 *
 * @param values - Array of values to level
 * @returns Array of { value, level } objects
 *
 * @example
 * const amounts = [0, 1000, 2000, 3000, 5000];
 * const leveled = calculateLevels(amounts);
 * // Returns: [
 * //   { value: 0, level: 0 },
 * //   { value: 1000, level: 1 },
 * //   { value: 2000, level: 2 },
 * //   { value: 3000, level: 3 },
 * //   { value: 5000, level: 4 }
 * // ]
 */
export function calculateLevels(
  values: number[]
): Array<{ value: number; level: 0 | 1 | 2 | 3 | 4 }> {
  // Filter out zeros for percentile calculation
  const nonZeroValues = values.filter(v => v > 0);

  if (nonZeroValues.length === 0) {
    // All values are zero
    return values.map(value => ({ value, level: 0 as const }));
  }

  // Calculate percentiles from non-zero values
  const percentiles = getPercentiles(nonZeroValues, [25, 50, 75]) as {
    25: number;
    50: number;
    75: number;
  };

  // Map each value to a level
  return values.map(value => ({
    value,
    level: mapValueToLevel(value, percentiles)
  }));
}
