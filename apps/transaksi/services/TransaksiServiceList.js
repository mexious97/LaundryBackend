const BaseServiceQueryBuilder = require("../../base/services/BaseServiceQueryBuilder");
const BaseServicePaginator = require("../../base/services/BaseServicePaginator");
const { TRANSAKSI_CONFIG_MAIN_TABLE } = require("../config");

const TransaksiServiceList = async (terms, page) => {
  const queryBuilder = BaseServiceQueryBuilder(TRANSAKSI_CONFIG_MAIN_TABLE);

  if (terms) {
    queryBuilder.whereILike("NO_FAKTUR", `%${terms}%`);
  }

  return {
    ...(await BaseServicePaginator(page, queryBuilder)),
    terms: terms ? terms : "",
  };
};

module.exports = TransaksiServiceList;
