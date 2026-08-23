/**
 * Currency Formatting & Parsing Utility (IDR - Indonesian Rupiah)
 * Designed for precision, zero-drift arithmetic, and clean UX.
 */

/**
 * Format a number/decimal to Indonesian Rupiah standard format: "Rp 1.250.000"
 */
export function formatRupiah(amount: number | string | bigint | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") {
    return "Rp 0";
  }

  const num = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (isNaN(num)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(num)
    .replace(/\u00a0/g, " ");
}

/**
 * Format a number to compact format for mobile charts/badges: "Rp 1,25 Jt", "Rp 500 Rb"
 */
export function formatCompactRupiah(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") {
    return "Rp 0";
  }

  const num = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (isNaN(num)) return "Rp 0";

  if (Math.abs(num) >= 1_000_000_000) {
    return `Rp ${(num / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
  }
  if (Math.abs(num) >= 1_000_000) {
    return `Rp ${(num / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Jt`;
  }
  if (Math.abs(num) >= 1_000) {
    return `Rp ${(num / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Rb`;
  }

  return formatRupiah(num);
}

/**
 * Parse user string input (e.g. "1.500.000" or "Rp 50.000") into a clean positive number.
 */
export function parseRupiahInput(input: string): number {
  if (!input) return 0;
  // Strip everything except digits and minus
  const cleaned = input.replace(/[^0-9-]/g, "");
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}
