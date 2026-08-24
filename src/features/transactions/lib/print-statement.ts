import { TransactionWithRelations } from "../actions";
import { formatRupiah } from "@/lib/currency";

interface PrintStatementOptions {
  transactions: TransactionWithRelations[];
  periodLabel: string;
  userName?: string | null;
}

export function printFinancialStatement({
  transactions,
  periodLabel,
  userName = "Pengguna",
}: PrintStatementOptions) {
  const d = new Date();
  const yearMonth = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
  const hash = (transactions.length * 137 + 1000) % 9000;
  const documentId = `FT-${yearMonth}-${1000 + hash}`;
  const printDateStr = d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const printTimeStr = d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netCashflow = totalIncome - totalExpense;

  // Category Breakdown
  const categoryMap = new Map<string, { name: string; amount: number; count: number }>();
  transactions
    .filter((t) => t.type === "EXPENSE")
    .forEach((t) => {
      const catName = t.category?.name || "Lainnya";
      const existing = categoryMap.get(catName) || { name: catName, amount: 0, count: 0 };
      existing.amount += Number(t.amount);
      existing.count += 1;
      categoryMap.set(catName, existing);
    });

  const categoryBreakdown = Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount);

  // HTML Generation for Print
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Keuangan - ${periodLabel}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 10pt;
      line-height: 1.4;
      padding: 0;
      margin: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .statement-container {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
    }

    /* HEADER */
    .header-table {
      width: 100%;
      border-bottom: 2.5px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .brand-title {
      font-size: 18pt;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #0f172a;
      text-transform: uppercase;
    }
    .brand-subtitle {
      font-size: 8pt;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 1px;
    }
    .brand-desc {
      font-size: 8.5pt;
      color: #64748b;
      margin-top: 4px;
    }

    .meta-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 8.5pt;
      line-height: 1.5;
      text-align: left;
      min-width: 220px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    .meta-label {
      color: #64748b;
    }
    .meta-val {
      font-weight: 700;
      color: #0f172a;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    /* SECTION TITLES */
    .section-title {
      font-size: 9pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0f172a;
      margin-bottom: 8px;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 4px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    /* SUMMARY TILES */
    .summary-grid {
      display: flex;
      gap: 12px;
      margin-bottom: 18px;
    }
    .summary-card {
      flex: 1;
      border-radius: 6px;
      padding: 10px 12px;
      border: 1.5px solid #e2e8f0;
      background: #fafafa;
    }
    .summary-card.income {
      border-color: #86efac;
      background: #f0fdf4;
    }
    .summary-card.expense {
      border-color: #fca5a5;
      background: #fef2f2;
    }
    .summary-card.cashflow {
      border-color: #93c5fd;
      background: #eff6ff;
    }
    .card-label {
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .income .card-label { color: #166534; }
    .expense .card-label { color: #991b1b; }
    .cashflow .card-label { color: #1e40af; }
    .card-value {
      font-size: 13pt;
      font-weight: 900;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      letter-spacing: -0.3px;
    }
    .income .card-value { color: #15803d; }
    .expense .card-value { color: #b91c1c; }
    .cashflow .card-value { color: #1d4ed8; }

    /* TABLES */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      font-size: 8.5pt;
    }
    .data-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 7.5pt;
      letter-spacing: 0.5px;
      padding: 6px 10px;
      border-top: 1.5px solid #cbd5e1;
      border-bottom: 1.5px solid #cbd5e1;
      text-align: left;
    }
    .data-table td {
      padding: 6px 10px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
    }
    .data-table tr:nth-child(even) td {
      background: #f8fafc;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .font-mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 700;
    }
    .amount-income { color: #15803d; font-weight: 800; }
    .amount-expense { color: #b91c1c; font-weight: 800; }
    .amount-transfer { color: #1d4ed8; font-weight: 800; }

    /* FOOTER */
    .statement-footer {
      border-top: 1.5px solid #cbd5e1;
      padding-top: 8px;
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5pt;
      color: #64748b;
    }

    /* SCREEN PREVIEW CONTROLS */
    @media screen {
      body {
        background: #090d16;
        padding: 24px 12px 60px;
        min-height: 100vh;
      }
      .no-print-toolbar {
        position: sticky;
        top: 12px;
        z-index: 9999;
        max-width: 800px;
        margin: 0 auto 20px;
        padding: 12px 18px;
        background: #182234;
        border: 1px solid #334155;
        border-radius: 14px;
        color: #f8fafc;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 10px 30px -5px rgba(0,0,0,0.6);
        font-size: 13px;
      }
      .toolbar-btn-print {
        background: #2563eb;
        color: #ffffff;
        border: none;
        padding: 8px 16px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .toolbar-btn-print:hover {
        background: #1d4ed8;
      }
      .toolbar-btn-close {
        background: #334155;
        color: #e2e8f0;
        border: none;
        padding: 8px 14px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 12px;
        cursor: pointer;
        margin-left: 8px;
      }
      .toolbar-btn-close:hover {
        background: #475569;
      }
      .statement-container {
        max-width: 800px;
        margin: 0 auto;
        background: #ffffff;
        padding: 40px 48px;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
      }
    }

    @media print {
      .no-print-toolbar {
        display: none !important;
      }
      body {
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .statement-container {
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      tr, .summary-card, .meta-box {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      thead {
        display: table-header-group;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-toolbar">
    <div style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
      <span>📄 Pratinjau Cetak Laporan Keuangan (${periodLabel})</span>
    </div>
    <div>
      <button onclick="window.print()" class="toolbar-btn-print">🖨️ Cetak / Simpan PDF</button>
      <button onclick="window.close()" class="toolbar-btn-close">✕ Tutup</button>
    </div>
  </div>

  <div class="statement-container">
    <!-- HEADER -->
    <table style="width: 100%; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 14px;">
      <tr>
        <td style="vertical-align: top;">
          <div class="brand-title">FINANCETRACKER</div>
          <div class="brand-subtitle">Personal Financial Statement</div>
          <div class="brand-desc">Laporan Rekapitulasi Arus Kas, Mutasi & Anggaran Finansial</div>
        </td>
        <td style="vertical-align: top; width: 240px;">
          <div class="meta-box">
            <div class="meta-row">
              <span class="meta-label">No. Dokumen</span>
              <span class="meta-val">${documentId}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Nama Akun</span>
              <span class="meta-val" style="color: #0f172a; font-family: inherit;">${userName}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Periode</span>
              <span class="meta-val" style="color: #1d4ed8;">${periodLabel}</span>
            </div>
            <div class="meta-row" style="margin-top: 4px; padding-top: 4px; border-top: 1px dashed #cbd5e1;">
              <span class="meta-label">Tanggal Cetak</span>
              <span class="meta-val">${printDateStr}</span>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- EXECUTIVE CASHFLOW SUMMARY -->
    <div class="summary-grid">
      <div class="summary-card income">
        <div class="card-label">Total Pemasukan</div>
        <div class="card-value">+${formatRupiah(totalIncome)}</div>
      </div>
      <div class="summary-card expense">
        <div class="card-label">Total Pengeluaran</div>
        <div class="card-value">-${formatRupiah(totalExpense)}</div>
      </div>
      <div class="summary-card cashflow">
        <div class="card-label">Arus Kas Bersih (Net)</div>
        <div class="card-value">${netCashflow >= 0 ? "+" : ""}${formatRupiah(netCashflow)}</div>
      </div>
    </div>

    <!-- CATEGORY BREAKDOWN -->
    ${
      categoryBreakdown.length > 0
        ? `
      <div class="section-title">
        <span>Rincian Pengeluaran per Kategori</span>
        <span style="font-size: 7.5pt; font-weight: normal; color: #64748b;">${categoryBreakdown.length} Kategori</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Kategori Belanja</th>
            <th class="text-center" style="width: 90px;">Frekuensi</th>
            <th class="text-right" style="width: 140px;">Total Pengeluaran</th>
            <th class="text-right" style="width: 70px;">Porsi</th>
          </tr>
        </thead>
        <tbody>
          ${categoryBreakdown
            .map((cat) => {
              const pct = totalExpense > 0 ? Math.round((cat.amount / totalExpense) * 100) : 0;
              return `
            <tr>
              <td style="font-weight: 600;">${cat.name}</td>
              <td class="text-center" style="color: #64748b;">${cat.count}x</td>
              <td class="text-right font-mono" style="color: #b91c1c;">${formatRupiah(cat.amount)}</td>
              <td class="text-right font-mono" style="color: #475569;">${pct}%</td>
            </tr>
          `;
            })
            .join("")}
        </tbody>
      </table>
    `
        : ""
    }

    <!-- TRANSACTION LEDGER TABLE -->
    <div class="section-title">
      <span>Buku Mutasi Transaksi</span>
      <span style="font-size: 7.5pt; font-weight: normal; color: #64748b;">${transactions.length} Mutasi Tercatat</span>
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 95px;">Tanggal</th>
          <th>Keterangan / Transaksi</th>
          <th style="width: 120px;">Kategori</th>
          <th style="width: 110px;">Rekening</th>
          <th class="text-right" style="width: 130px;">Nominal (Rp)</th>
        </tr>
      </thead>
      <tbody>
        ${
          transactions.length === 0
            ? `
          <tr>
            <td colspan="5" style="text-align: center; padding: 20px; color: #94a3b8;">
              Tidak ada catatan transaksi pada periode ini.
            </td>
          </tr>
        `
            : transactions
                .map((tx) => {
                  const dateObj = new Date(tx.date);
                  const dateStr = dateObj.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  const amountClass =
                    tx.type === "INCOME"
                      ? "amount-income"
                      : tx.type === "EXPENSE"
                      ? "amount-expense"
                      : "amount-transfer";
                  const prefix = tx.type === "INCOME" ? "+" : tx.type === "EXPENSE" ? "-" : "";

                  return `
            <tr>
              <td class="font-mono" style="color: #475569; font-size: 8pt; white-space: nowrap;">${dateStr}</td>
              <td style="font-weight: 600; color: #0f172a;">${
                tx.description ||
                (tx.type === "TRANSFER"
                  ? "Transfer Antar Rekening"
                  : tx.category?.name || "Transaksi")
              }</td>
              <td style="color: #64748b;">${tx.type === "TRANSFER" ? "Transfer" : tx.category?.name || "Lainnya"}</td>
              <td style="color: #475569; font-size: 8pt;">${tx.account.name}${
                    tx.targetAccount ? ` ➔ ${tx.targetAccount.name}` : ""
                  }</td>
              <td class="text-right font-mono ${amountClass}" style="white-space: nowrap;">${prefix}${formatRupiah(
                    Number(tx.amount)
                  )}</td>
            </tr>
          `;
                })
                .join("")
        }
      </tbody>
    </table>

    <!-- FOOTER -->
    <div class="statement-footer">
      <div>✓ Dokumen Resmi Diterbitkan Otomatis oleh Sistem FinanceTracker</div>
      <div style="font-family: ui-monospace, monospace;">Dicetak: ${printDateStr} ${printTimeStr} WIB</div>
    </div>
  </div>
</body>
</html>`;

  // 1. Primary Method: Open clean standalone printable window (Works on Chrome, iOS Safari, Android, Edge, Firefox)
  try {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      setTimeout(() => {
        try {
          printWindow.focus();
        } catch (err) {
          console.warn("Print window focus error:", err);
        }
      }, 100);
      return;
    }
  } catch (e) {
    console.warn("window.open failed, falling back to iframe print:", e);
  }

  // 2. Fallback Method: Isolated iframe injection if popups are strictly blocked
  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "Print Statement");
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  iframe.style.zIndex = "-9999";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error("Iframe print error:", err);
      }
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 4000);
    }, 400);
  }
}
