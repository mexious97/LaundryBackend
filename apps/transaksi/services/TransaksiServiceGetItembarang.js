const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { PEMBELIAN_CONFIG_ITEM_BARANG_TABLE } = require("../config");

const TransaksiServiceGetItemBarang = async (field, value, many = false) => {
  const results = await BaseServiceQueryBuilder(
    PEMBELIAN_CONFIG_ITEM_BARANG_TABLE
  ).where({ [field]: value });
  if (many) {
    return results;
  }

  return results[0];
};

module.exports =TransaksiServiceGetItemBarang;
