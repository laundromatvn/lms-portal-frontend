export type CompactCurrencyOptions = {
  maximumFractionDigits?: number;
  suffixes?: Partial<Record<'K' | 'M' | 'B' | 'T', string>>;
};

const DEFAULT_SUFFIXES: Record<'K' | 'M' | 'B' | 'T', string> = {
  K: 'K',
  M: 'M',
  B: 'B',
  T: 'T',
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

function formatWithMaxDecimals(value: number, maxDecimals: number): string {
  if (Number.isInteger(value)) return String(value);
  const fixed = value.toFixed(Math.max(0, maxDecimals));
  return fixed.replace(/\.0+$|(\.\d*[1-9])0+$/, '$1');
}

/**
 * Formats a number into a compact currency-like string.
 * Examples:
 *  - 20000 -> "20K"
 *  - 1530000 -> "1.5M"
 *  - -1250000000 -> "-1.25B"
 */
export function formatCurrencyCompact(
  input: number | string,
  options?: CompactCurrencyOptions
): string {
  const num = coerceToNumber(input);
  const maximumFractionDigits = options?.maximumFractionDigits ?? 2;
  const suffixes = { ...DEFAULT_SUFFIXES, ...(options?.suffixes ?? {}) };

  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);

  const units: Array<{ value: number; symbol: string }> = [
    { value: 1e12, symbol: suffixes.T },
    { value: 1e9, symbol: suffixes.B },
    { value: 1e6, symbol: suffixes.M },
    { value: 1e3, symbol: suffixes.K },
  ];

  for (const unit of units) {
    if (abs >= unit.value) {
      const scaled = abs / unit.value;
      // Use up to maximumFractionDigits, but drop trailing zeros
      const display = formatWithMaxDecimals(
        scaled,
        Math.max(0, maximumFractionDigits)
      );
      return `${sign}${display}${unit.symbol} ${currencySymbol}`;
    }
  }

  // For values below 1000, return as-is (no grouping), trimming decimals
  return `${sign}${formatWithMaxDecimals(abs, Math.max(0, maximumFractionDigits))} ${currencySymbol}`;
}

export default formatCurrencyCompact;


