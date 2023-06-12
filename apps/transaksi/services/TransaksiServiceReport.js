const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const {
  TRANSAKSI_CONFIG_MAIN_TABLE,
  TRANSAKSI_CONFIG_ITEM_BARANG_TABLE,
} = require("../config");

const TransaksiServiceReport = async (startDate, endDate, terms) => {
  let subQuery = await BaseServiceQueryBuilder(TRANSAKSI_CONFIG_MAIN_TABLE)
    .clone()
    .select("no_faktur")
    .whereBetween("tanggal", [startDate, endDate]);

  subQuery = JSON.parse(JSON.stringify(subQuery)).map((item) => item.no_faktur);

  let results = BaseServiceQueryBuilder(TRANSAKSI_CONFIG_ITEM_BARANG_TABLE)
    .select(["nama_barang", "kode_barang", "qty"])
    .whereIn("no_faktur", subQuery);

  if (terms) {
    results = await results
      .sum("qty as qty")
      .whereILike("kodeBarang", `%${terms}%`)
      .orWhereILike("namaBarang", `%${terms}%`)
      .groupBy("kodeBarang");
  } else {
    results = await results.sum("qty as qty").groupBy("kodeBarang");
  }

  return results;
};

module.exports = TransaksiServiceReport;
