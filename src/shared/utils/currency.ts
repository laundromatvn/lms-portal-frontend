export type CompactCurrencyOptions = {
  maximumFractionDigits?: number;
};

const currencySymbol = 'đ';

function coerceToNumber(input: number | string | null | undefined): number {
  if (typeof input === 'number') return Number.isFinite(input) ? input : 0;
  if (typeof input === 'string') {
    const normalized = input.replace(/[,\s]/g, '');
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

/**
 * Formats a number into a comma-separated currency string with trailing symbol.
 * Examples:
 *  - 20000 -> "20,000 đ"
 *  - 1530000 -> "1,530,000 đ"
 *  - -1250000 -> "-1,250,000 đ"
 */
export function formatCurrencyCompact(
  input: number | string,
  options?: CompactCurrencyOptions
): string {
  const num = coerceToNumber(input);
  const maximumFractionDigits = options?.maximumFractionDigits ?? 0;

  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);

  const formatted = new Intl.NumberFormat('en-US', {
    useGrouping: true,
    maximumFractionDigits: Math.max(0, maximumFractionDigits),
    minimumFractionDigits: 0,
  }).format(abs);

  return `${sign}${formatted} ${currencySymbol}`;
}

export default formatCurrencyCompact;


