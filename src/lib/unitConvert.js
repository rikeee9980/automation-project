/**
 * Nepal Land Unit Conversion Utility
 *
 * Hill System:  1 Ropani = 16 Aana, 1 Aana = 4 Paisa, 1 Paisa = 4 Dam
 * Terai System: 1 Bigha = 20 Kattha, 1 Kattha = 20 Dhur
 *
 * Base unit: Square Feet
 *  1 Ropani  = 5476 sqft
 *  1 Aana    = 342.25 sqft
 *  1 Paisa   = 85.5625 sqft
 *  1 Dam     = 21.390625 sqft
 *  1 Bigha   = 72900 sqft (Terai)
 *  1 Kattha  = 3645 sqft
 *  1 Dhur    = 182.25 sqft
 *  1 Sq Meter = 10.7639 sqft
 */

// Conversion factors to square feet
const SQFT_PER = {
  ropani: 5476,
  aana: 342.25,
  paisa: 85.5625,
  dam: 21.390625,
  bigha: 72900,
  kattha: 3645,
  dhur: 182.25,
  sqft: 1,
  sqm: 10.7639,
};

/**
 * Convert a value from one unit to all supported units.
 * @param {number} value - The numeric value to convert
 * @param {string} fromUnit - Source unit key (e.g., 'ropani', 'sqft')
 * @returns {Object} An object containing all converted values
 */
export function convertLandUnits(value, fromUnit) {
  if (!value || value <= 0 || !SQFT_PER[fromUnit]) {
    return Object.keys(SQFT_PER).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
  }

  const totalSqft = value * SQFT_PER[fromUnit];

  const result = {};
  for (const [unit, factor] of Object.entries(SQFT_PER)) {
    result[unit] = totalSqft / factor;
  }

  return result;
}

/**
 * Format area into a Ropani-Aana-Paisa-Dam string from sqft.
 * @param {number} sqft - Area in square feet
 * @returns {string} Formatted string like "2-3-1-0"
 */
export function sqftToRopaniBreakdown(sqft) {
  if (!sqft || sqft <= 0) return '0-0-0-0';

  let remaining = sqft;
  const ropani = Math.floor(remaining / SQFT_PER.ropani);
  remaining -= ropani * SQFT_PER.ropani;

  const aana = Math.floor(remaining / SQFT_PER.aana);
  remaining -= aana * SQFT_PER.aana;

  const paisa = Math.floor(remaining / SQFT_PER.paisa);
  remaining -= paisa * SQFT_PER.paisa;

  const dam = Math.floor(remaining / SQFT_PER.dam);

  return `${ropani}-${aana}-${paisa}-${dam}`;
}

/**
 * Format a local area object { ropani, aana, paisa, dam } into a human-readable string.
 * @param {Object} areaLocal
 * @returns {string}
 */
export function formatAreaLocal(areaLocal) {
  if (!areaLocal) return '';
  const { ropani = 0, aana = 0, paisa = 0, dam = 0 } = areaLocal;
  const parts = [];
  if (ropani > 0) parts.push(`${ropani} Ropani`);
  if (aana > 0) parts.push(`${aana} Aana`);
  if (paisa > 0) parts.push(`${paisa} Paisa`);
  if (dam > 0) parts.push(`${dam} Dam`);
  return parts.length > 0 ? parts.join(' ') : '';
}

/**
 * All supported unit definitions for UI display
 */
export const UNIT_OPTIONS = [
  { key: 'ropani', label: 'Ropani', system: 'Hill' },
  { key: 'aana', label: 'Aana', system: 'Hill' },
  { key: 'paisa', label: 'Paisa', system: 'Hill' },
  { key: 'dam', label: 'Dam', system: 'Hill' },
  { key: 'bigha', label: 'Bigha', system: 'Terai' },
  { key: 'kattha', label: 'Kattha', system: 'Terai' },
  { key: 'dhur', label: 'Dhur', system: 'Terai' },
  { key: 'sqft', label: 'Sq. Feet', system: 'Universal' },
  { key: 'sqm', label: 'Sq. Meters', system: 'Universal' },
];
