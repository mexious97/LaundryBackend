const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const {
  TRANSAKSI_CONFIG_MAIN_TABLE,
  TRANSAKSI_CONFIG_ITEM_BARANG_TABLE,
} = require("../config");

const TransaksiServiceCreate = async (
  faktur,
  tanggal,
  total,
  dibayar,
  kembali,
  items
) => {
  const dataTransaksi = {
    faktur,
    tanggal,
    total,
    dibayar,
    kembali,
  };

  const dataItemTransaksi = items.map((item) => {
    return {
      id,
      no_faktur: faktur,
      kode_barang: item.kodeBarang,
      nama_barang: item.namaBarang,
      qty: item.jumlahBeli,
    };
  });

  await BaseServiceQueryBuilder.transaction(async (trx) => {
    await BaseServiceQueryBuilder(TRANSAKSI_CONFIG_MAIN_TABLE)
      .insert(dataItemTransaksi)
      .transacting(trx);

    await BaseServiceQueryBuilder(TRANSAKSI_CONFIG_ITEM_BARANG_TABLE).insert(
      dataItemTransaksi
    );
  });

  return { ...dataTransaksi, items: dataItemTransaksi };
};

module.exports = TransaksiServiceCreate;
