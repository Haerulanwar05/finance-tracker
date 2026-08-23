import { TransactionWithRelations } from "../actions";

export function exportTransactionsToCsv(
  transactions: TransactionWithRelations[],
  filename = "laporan-keuangan.csv"
) {
  const headers = [
    "Tanggal",
    "Waktu",
    "Tipe",
    "Rekening Asal",
    "Rekening Tujuan",
    "Kategori",
    "Deskripsi",
    "Nominal (Rp)",
  ];

  const rows = transactions.map((tx) => {
    const dateObj = new Date(tx.date);
    const dateStr = dateObj.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeStr = dateObj.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const typeStr =
      tx.type === "INCOME"
        ? "Pemasukan"
        : tx.type === "EXPENSE"
        ? "Pengeluaran"
        : "Transfer Antar Rekening";

    const escapeCsv = (str: string | null | undefined) => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""');
      return `"${clean}"`;
    };

    return [
      escapeCsv(dateStr),
      escapeCsv(timeStr),
      escapeCsv(typeStr),
      escapeCsv(tx.account.name),
      escapeCsv(tx.targetAccount?.name || "-"),
      escapeCsv(tx.category?.name || "Lainnya"),
      escapeCsv(tx.description || "-"),
      tx.amount.toString(),
    ].join(",");
  });

  // Add UTF-8 BOM so Microsoft Excel renders Indonesian characters correctly
  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
