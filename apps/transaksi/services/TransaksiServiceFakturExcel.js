const xl = require("exceljs");
const BaseServiceExcelColumnResponsive = require("../../base/services/BaseServiceExcelColumnResponsive");
const {
  BASE_CONFIG_EXCEL_FONT_HEADER,
  BASE_CONFIG_EXCEL_FILL_HEADER,
  BASE_CONFIG_EXCEL_BORDER,
} = require("../../base/config");

const TransaksiServiceFakturExcel = async (transaksi, pelanggan, items) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet(`faktur`);

  ws.getCell("D1").font = BASE_CONFIG_EXCEL_FONT_HEADER;
  ws.getCell("D2").font = BASE_CONFIG_EXCEL_FONT_HEADER;
  ws.getCell("D3").font = BASE_CONFIG_EXCEL_FONT_HEADER;

  ws.getCell("A1").fill = BASE_CONFIG_EXCEL_FILL_HEADER;
  ws.getCell("A2").fill = BASE_CONFIG_EXCEL_FILL_HEADER;
  ws.getCell("D1").fill = BASE_CONFIG_EXCEL_FILL_HEADER;
  ws.getCell("D2").fill = BASE_CONFIG_EXCEL_FILL_HEADER;
  ws.getCell("D3").fill = BASE_CONFIG_EXCEL_FILL_HEADER;

  ws.getCell("A1").border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell("A2").border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell("D1").border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell("D2").border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell("D3").border = BASE_CONFIG_EXCEL_BORDER;

  // Detail faktur
  ws.getCell("A1").value = "FAKTUR NO.";
  ws.getCell("A2").value = "TANGGAL";
  ws.getCell("A1").font = BASE_CONFIG_EXCEL_FONT_HEADER;
  ws.getCell("A2").font = BASE_CONFIG_EXCEL_FONT_HEADER;

  ws.getCell("B1").value = transaksi.faktur;
  ws.getCell("B2").value = transaksi.tanggal.toISOString().split("T")[0];
  ws.getCell("B1").border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell("B2").border = BASE_CONFIG_EXCEL_BORDER;

  // Detail pelanngan
  ws.getCell("D1").value = "KODE PELANGGAN";
  ws.getCell("D2").value = "NAMA PELANGGAN";
  ws.getCell("D3").value = "TELEPON PELANGGAN";
  ws.getCell("E1").value = pelanggan.kode_pelanggan;
  ws.getCell("E2").value = pelanggan.nama_pelanggan;
  ws.getCell("E3").value = pelanggan.telepon_pelanggan;
  ws.getCell("E1").border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell("E2").border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell("E3").border = BASE_CONFIG_EXCEL_BORDER;

  // Detail items
  // Set detail item headers value
  ws.getCell("A5").value = "ID ";
  ws.getCell("B5").value = "NO FAKTUR";
  ws.getCell("C5").value = "KODE BARANG";
  ws.getCell("D5").value = "NAMA BARANG";
  ws.getCell("E5").value = "QTY";

  // Set detail item headers style font
  ws.getCell("A5").font = BASE_CONFIG_EXCEL_FONT_HEADER;
  ws.getCell("B5").font = BASE_CONFIG_EXCEL_FONT_HEADER;
  ws.getCell("C5").font = BASE_CONFIG_EXCEL_FONT_HEADER;
  ws.getCell("D5").font = BASE_CONFIG_EXCEL_FONT_HEADER;
  ws.getCell("E5").font = BASE_CONFIG_EXCEL_FONT_HEADER;

  // Set detail item headers style fill
  ws.getCell("A5").fill = BASE_CONFIG_EXCEL_FILL_HEADER;
  ws.getCell("B5").fill = BASE_CONFIG_EXCEL_FILL_HEADER;
  ws.getCell("C5").fill = BASE_CONFIG_EXCEL_FILL_HEADER;
  ws.getCell("D5").fill = BASE_CONFIG_EXCEL_FILL_HEADER;
  ws.getCell("E5").fill = BASE_CONFIG_EXCEL_FILL_HEADER;

  // Set detail item headers style border
  ws.getCell("A5").border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell("B5").border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell("C5").border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell("D5").border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell("E5").border = BASE_CONFIG_EXCEL_BORDER;

  colNumber = 6;
  for (const item of items) {
    worksheet.getCell(`A${rowNumber}`).value = item.id;
    worksheet.getCell(`B${rowNumber}`).value = item.no_faktur;
    worksheet.getCell(`C${rowNumber}`).value = item.kode_barang;
    worksheet.getCell(`D${rowNumber}`).value = item.nama_barang;
    worksheet.getCell(`E${rowNumber}`).value = item.qty;

    ws.getCell(`A${colNumber}`).border = BASE_CONFIG_EXCEL_BORDER;
    ws.getCell(`B${colNumber}`).border = BASE_CONFIG_EXCEL_BORDER;
    ws.getCell(`C${colNumber}`).border = BASE_CONFIG_EXCEL_BORDER;
    ws.getCell(`D${colNumber}`).border = BASE_CONFIG_EXCEL_BORDER;
    ws.getCell(`E${colNumber}`).border = BASE_CONFIG_EXCEL_BORDER;
    colNumber = colNumber + 1;
  }

  // untuk total, dibayar dan kembali
  // header
  ws.getCell(`D${colNumber}`).value = "GRAND TOTAL";
  ws.getCell(`D${colNumber + 1}`).value = "DIBAYAR";
  ws.getCell(`D${colNumber + 2}`).value = "KEMBALI";
  ws.getCell(`D${colNumber}`).font = BASE_CONFIG_EXCEL_FONT_HEADER;
  ws.getCell(`D${colNumber + 1}`).font = BASE_CONFIG_EXCEL_FONT_HEADER;
  ws.getCell(`D${colNumber + 2}`).font = BASE_CONFIG_EXCEL_FONT_HEADER;
  ws.getCell(`D${colNumber}`).fill = BASE_CONFIG_EXCEL_FILL_HEADER;
  ws.getCell(`D${colNumber + 1}`).fill = BASE_CONFIG_EXCEL_FILL_HEADER;
  ws.getCell(`D${colNumber + 2}`).fill = BASE_CONFIG_EXCEL_FILL_HEADER;
  ws.getCell(`D${colNumber}`).border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell(`D${colNumber + 1}`).border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell(`D${colNumber + 2}`).border = BASE_CONFIG_EXCEL_BORDER;

  // value
  ws.getCell(`E${colNumber}`).value = transaksi.total;
  ws.getCell(`E${colNumber + 1}`).value = transaksi.dibayar;
  ws.getCell(`E${colNumber + 2}`).value = transaksi.kembali;
  ws.getCell(`E${colNumber}`).border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell(`E${colNumber + 1}`).border = BASE_CONFIG_EXCEL_BORDER;
  ws.getCell(`E${colNumber + 2}`).border = BASE_CONFIG_EXCEL_BORDER;

  BaseServiceExcelColumnResponsive(ws);
  return wb.xlsx;
};

module.exports = TransaksiServiceFakturExcel;
