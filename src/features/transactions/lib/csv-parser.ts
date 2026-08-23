import { CsvTransactionRow } from "../schema";

export interface ParsedCsvResult {
  success: boolean;
  rows: CsvTransactionRow[];
  totalIncome: number;
  totalExpense: number;
  errors: string[];
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Makanan & Minuman": [
    "makan",
    "resto",
    "cafe",
    "kopi",
    "coffee",
    "warung",
    "indomaret",
    "alfamart",
    "gofood",
    "grabfood",
    "shopeefood",
    "mcd",
    "kfc",
    "starbucks",
    "bakso",
    "food",
    "snack",
    "kuliner",
    "roti",
    "mie",
  ],
  "Transportasi & Bensin": [
    "pertamina",
    "shell",
    "spbu",
    "bensin",
    "grab",
    "gojek",
    "goride",
    "gocar",
    "tol",
    "parkir",
    "kereta",
    "kai",
    "flight",
    "garuda",
    "tiket",
    "blue bird",
    "mybluebird",
    "ojek",
    "bengkel",
  ],
  "Tagihan & Utilitas": [
    "pln",
    "listrik",
    "pdam",
    "air",
    "indihome",
    "wifi",
    "telkomsel",
    "xl",
    "tri",
    "bpjs",
    "asuransi",
    "pajak",
    "iuran",
    "biznet",
    "myrepublic",
    "pulsa",
    "paket data",
  ],
  "Belanja & Kebutuhan": [
    "tokopedia",
    "shopee",
    "lazada",
    "tiktok shop",
    "supermarket",
    "hypermart",
    "superindo",
    "uniqlo",
    "zara",
    "alfamidi",
    "lotte",
    "ikea",
    "ace hardware",
    "market",
    "mall",
  ],
  "Bisnis & Penjualan": [
    "penjualan",
    "hasil penjualan",
    "omset",
    "omzet",
    "sales",
    "revenue",
    "qris",
    "edc",
    "merchant",
    "pos",
    "order",
    "pesanan",
    "toko",
    "kliring masuk",
    "setoran tunai",
    "setor tunai",
    "setoran",
    "pelunasan",
    "invoice",
    "pembayaran",
    "customer",
    "pembeli",
    "dana masuk",
    "uang masuk",
    "bni",
  ],
  "Gaji & Penghasilan": [
    "gaji",
    "salary",
    "payroll",
    "honor",
    "bonus",
    "dividen",
    "project",
    "invoice",
    "transfer dari",
    "pt ",
    "thr",
    "komisi",
    "pendapatan",
    "penghasilan",
    "terima dana",
  ],
};

function guessCategory(description: string, type: "EXPENSE" | "INCOME"): string {
  const lower = description.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (type === "INCOME" && category !== "Gaji & Penghasilan" && category !== "Bisnis & Penjualan") continue;
    if (type === "EXPENSE" && (category === "Gaji & Penghasilan" || category === "Bisnis & Penjualan")) continue;

    if (keywords.some((kw) => lower.includes(kw))) {
      return category;
    }
  }
  return type === "INCOME" ? "Bisnis & Penjualan" : "Pengeluaran Umum";
}

function parseIndonesianDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const clean = dateStr.trim().replace(/['"]/g, "");

  // Format DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmyMatch = clean.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    let year = parseInt(dmyMatch[3], 10);
    if (year < 100) year += 2000;
    return new Date(year, month, day);
  }

  // Standard ISO YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = clean.match(/^(\d{4})[/.\-](\d{1,2})[/.\-](\d{1,2})/);
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10));
  }

  const parsed = new Date(clean);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

function parseIndonesianAmount(amountStr: string): number {
  if (!amountStr) return 0;
  let clean = amountStr.trim().replace(/[Rp\s]/gi, "");

  // Both dot and comma present (e.g. "1.250.000,50" or "1,250,000.50")
  if (clean.includes(".") && clean.includes(",")) {
    if (clean.lastIndexOf(",") > clean.lastIndexOf(".")) {
      // Indonesian: "1.250.000,50"
      clean = clean.replace(/\./g, "").replace(",", ".");
    } else {
      // International: "1,250,000.50"
      clean = clean.replace(/,/g, "");
    }
  } else if (clean.includes(".") && !clean.includes(",")) {
    // Only dot present (e.g. "35.000" or "1.500.000")
    const parts = clean.split(".");
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      clean = clean.replace(/\./g, "");
    }
  } else if (clean.includes(",") && !clean.includes(".")) {
    // Only comma present (e.g. "35,000" or "35,5")
    const parts = clean.split(",");
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      clean = clean.replace(/,/g, "");
    } else {
      clean = clean.replace(",", ".");
    }
  }

  const val = Math.abs(parseFloat(clean));
  return isNaN(val) ? 0 : val;
}

/**
 * Split CSV line respecting quoted strings with commas inside
 */
function splitCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(cur.replace(/^["']|["']$/g, "").trim());
      cur = "";
    } else {
      cur += char;
    }
  }
  result.push(cur.replace(/^["']|["']$/g, "").trim());
  return result;
}

/**
 * Universal Intelligent Bank CSV Mutation Parser
 */
export function parseBankCsv(csvContent: string): ParsedCsvResult {
  // Strip BOM & whitespace
  const sanitized = csvContent.replace(/^\uFEFF/, "").trim();
  const lines = sanitized
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return {
      success: false,
      rows: [],
      totalIncome: 0,
      totalExpense: 0,
      errors: ["File CSV kosong"],
    };
  }

  // Detect delimiter: comma, semicolon, or tab
  const sampleLine = lines[0];
  let delimiter = ",";
  if (sampleLine.split(";").length > sampleLine.split(",").length) {
    delimiter = ";";
  } else if (sampleLine.split("\t").length > sampleLine.split(",").length) {
    delimiter = "\t";
  }

  // Find header row (check first 5 lines for common column keywords)
  let headerIndex = -1;
  let dateColIdx = -1;
  let descColIdx = -1;
  let amountColIdx = -1;
  let debitColIdx = -1;
  let creditColIdx = -1;
  let typeColIdx = -1;

  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const rawCols = splitCsvLine(lines[i], delimiter).map((c) => c.toLowerCase());

    const dIdx = rawCols.findIndex((c) =>
      ["tanggal", "date", "tgl", "waktu", "time", "trans_date", "tx_date", "post date"].some((k) =>
        c.includes(k)
      )
    );
    const descIdx = rawCols.findIndex((c) =>
      [
        "keterangan",
        "description",
        "uraian",
        "rincian",
        "memo",
        "catatan",
        "note",
        "payee",
        "merchant",
        "detail",
        "narration",
      ].some((k) => c.includes(k))
    );
    const amtIdx = rawCols.findIndex((c) =>
      ["jumlah", "amount", "nominal", "total", "nilai", "mutasi", "value"].some((k) => c.includes(k))
    );
    const dbIdx = rawCols.findIndex((c) =>
      ["debet", "debit", "keluar", "pengeluaran", "db", "withdrawal", "out"].some(
        (k) => c === k || c.startsWith(k)
      )
    );
    const crIdx = rawCols.findIndex((c) =>
      ["kredit", "credit", "masuk", "pemasukan", "cr", "deposit", "in"].some(
        (k) => c === k || c.startsWith(k)
      )
    );
    const tIdx = rawCols.findIndex((c) =>
      ["tipe", "type", "jenis", "d/c", "db/cr", "cr/db", "status", "mutasi (db/cr)"].some((k) =>
        c.includes(k)
      )
    );

    if (dIdx !== -1 && (descIdx !== -1 || amtIdx !== -1 || dbIdx !== -1 || crIdx !== -1)) {
      headerIndex = i;
      dateColIdx = dIdx;
      descColIdx = descIdx;
      amountColIdx = amtIdx;
      debitColIdx = dbIdx;
      creditColIdx = crIdx;
      typeColIdx = tIdx;
      break;
    }
  }

  // If no header found, fallback to positional guessing (0: Date, 1: Desc, 2: Amount, 3: Type)
  const dataLines = headerIndex !== -1 ? lines.slice(headerIndex + 1) : lines;
  if (headerIndex === -1) {
    dateColIdx = 0;
    descColIdx = 1;
    amountColIdx = 2;
    typeColIdx = 3;
  }

  // If description was not found, fallback to column 1 or first text column
  if (descColIdx === -1) descColIdx = dateColIdx === 0 ? 1 : 0;
  // If amount was not found but debit/credit found, handle accordingly
  if (amountColIdx === -1 && debitColIdx === -1 && creditColIdx === -1) {
    amountColIdx = 2;
  }

  const errors: string[] = [];
  const rows: CsvTransactionRow[] = [];
  let totalIncome = 0;
  let totalExpense = 0;

  for (let i = 0; i < dataLines.length; i++) {
    const rawLine = dataLines[i];
    const cols = splitCsvLine(rawLine, delimiter);

    if (cols.length < 2) continue;

    try {
      const dateStr = cols[dateColIdx] || "";
      const desc = cols[descColIdx] || "Transaksi";

      let amount = 0;
      let type: "EXPENSE" | "INCOME" = "EXPENSE";

      // Case A: Separate Debit and Credit columns
      if (debitColIdx !== -1 && creditColIdx !== -1) {
        const debitVal = parseIndonesianAmount(cols[debitColIdx] || "");
        const creditVal = parseIndonesianAmount(cols[creditColIdx] || "");

        if (creditVal > 0) {
          amount = creditVal;
          type = "INCOME";
        } else if (debitVal > 0) {
          amount = debitVal;
          type = "EXPENSE";
        }
      } else if (amountColIdx !== -1 && cols[amountColIdx]) {
        // Case B: Single Amount column + Type column or sign
        const rawAmountStr = cols[amountColIdx];
        amount = parseIndonesianAmount(rawAmountStr);

        const typeIndicator = (typeColIdx !== -1 ? cols[typeColIdx] : "").toUpperCase().trim();

        if (
          typeIndicator === "CR" ||
          typeIndicator === "CREDIT" ||
          typeIndicator === "KREDIT" ||
          typeIndicator === "INCOME" ||
          typeIndicator === "PEMASUKAN" ||
          typeIndicator === "MASUK" ||
          rawAmountStr.startsWith("+")
        ) {
          type = "INCOME";
        } else if (
          typeIndicator === "DB" ||
          typeIndicator === "DEBIT" ||
          typeIndicator === "DEBET" ||
          typeIndicator === "EXPENSE" ||
          typeIndicator === "PENGELUARAN" ||
          typeIndicator === "KELUAR" ||
          rawAmountStr.startsWith("-")
        ) {
          type = "EXPENSE";
        } else {
          // Heuristic from description keywords
          const lowerDesc = desc.toLowerCase();
          if (
            lowerDesc.includes("transfer dari") ||
            lowerDesc.includes("terima") ||
            lowerDesc.includes("gaji") ||
            lowerDesc.includes("cashback") ||
            lowerDesc.includes("bunga") ||
            lowerDesc.includes("penjualan") ||
            lowerDesc.includes("omset") ||
            lowerDesc.includes("omzet") ||
            lowerDesc.includes("sales") ||
            lowerDesc.includes("revenue") ||
            lowerDesc.includes("qris") ||
            lowerDesc.includes("setoran") ||
            lowerDesc.includes("setor") ||
            lowerDesc.includes("pendapatan") ||
            lowerDesc.includes("uang masuk") ||
            lowerDesc.includes("dana masuk") ||
            lowerDesc.includes("invoice") ||
            lowerDesc.includes("pelunasan") ||
            lowerDesc.includes("bni")
          ) {
            type = "INCOME";
          }
        }
      }

      if (amount <= 0) continue;

      const date = parseIndonesianDate(dateStr);
      const suggestedCategory = guessCategory(desc, type);

      if (type === "INCOME") {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }

      rows.push({
        date,
        description: desc,
        amount,
        type,
        suggestedCategoryId: suggestedCategory,
      });
    } catch {
      errors.push(`Baris ${i + 1} dilewati: ${rawLine}`);
    }
  }

  return {
    success: rows.length > 0,
    rows,
    totalIncome,
    totalExpense,
    errors,
  };
}
