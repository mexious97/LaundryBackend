const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const { TRANSAKSI_CONFIG_MAIN_TABLE } = require("../config");
const _ = require("lodash");

const TransaksiServiceGet = async (field, value, many = false) => {
  const results = await BaseServiceQueryBuilder(
    TRANSAKSI_CONFIG_MAIN_TABLE
  ).where({ [field]: value });

  if (many) return results;

  const transaksi = results[0];

  return transaksi;
};

module.exports = TransaksiServiceGet;
