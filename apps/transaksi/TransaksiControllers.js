const UserServiceTokenAuthentication = require("../user/services/UserServiceTokenAuthentication");
const TransaksiValidators = require("./TransaksiValidators");
const BaseValidatorRun = require("../base/validators/BaseValidatorRun");
const TransaksiServiceCreate = require("./services/TransaksiServiceCreate");
const BaseValidatorFields = require("../base/validators/BaseValidatorFields");
const { query, param } = require("express-validator");
const TransaksiServiceList = require("./services/TransaksiServiceList");
const TransaksiServiceGet = require("./services/TransaksiServiceGet");
const PelangganServiceGet = require("../pelanggan/services/PelangganServiceGet");
const TransaksiServiceFakturExcel = require("./services/TransaksiServiceFakturExcel");
const TransaksiServiceReport = require("./services/TransaksiServiceReport");
const TransaksiServiceReportExcel = require("./services/TransaksiServiceReportExcel");
const TransaksiServiceGetItemBarang = require("./services/TransaksiServiceGetItembarang");

const TransaksiControllers = require("express").Router();

TransaksiControllers.post(
  "/",
  [
    UserServiceTokenAuthentication,
    TransaksiValidators.faktur(),
    TransaksiValidators.tanggal(),
    TransaksiValidators.total(),
    // TransaksiValidators.kode_pelanggan(),
    TransaksiValidators.dibayar(),
    TransaksiValidators.kembali(),
    TransaksiValidators.items.self(),
    TransaksiValidators.items.inner.kode_barang(),
    TransaksiValidators.items.inner.nama_barang(),
    BaseValidatorRun(),
  ],
  async (req, res) => {
    const transaksi = await TransaksiServiceCreate(
      req.body.faktur,
      req.body.tanggal,
      req.body.total,
      req.body.dibayar,
      req.body.kembali,
      // req.body.kode_pelanggan,
      req.body.items
    );
    res.status(201).json(transaksi);
  }
);

TransaksiControllers.get(
  "/",
  [
    UserServiceTokenAuthentication,
    BaseValidatorFields.page(),
    BaseValidatorFields.terms(query),
    BaseValidatorRun(),
  ],
  async (req, res) => {
    const daftarTransaksi = await TransaksiServiceList(
      req.query.terms,
      req.query.page
    );
    return res.status(200).json(daftarTransaksi);
  }
);

TransaksiControllers.get(
  "/:faktur",
  [
    UserServiceTokenAuthentication,
    TransaksiValidators.faktur(param, false),
    BaseValidatorRun(),
  ],
  async (req, res) => {
    const transaksi = await TransaksiServiceGet(
      "faktur",
      req.params.faktur,
      false
    );
    const items = await TransaksiServiceGetItemBarang(
      "faktur",
      req.params.faktur,
      true
    );

    return res.status(200).json({ ...transaksi, items });
  }
);

TransaksiControllers.post(
  "/:faktur/faktur-excel",
  [
    UserServiceTokenAuthentication,
    TransaksiValidators.faktur(param, false),
    BaseValidatorRun(),
  ],
  async (req, res) => {
    const transaksi = await TransaksiServiceGet(
      "faktur",
      req.params.faktur,
      false
    );

    const pelanggan = await PelangganServiceGet(
      "kode_pelanggan",
      pembelian.kode_pelanggan
    );
    const items = await TransaksiServiceGetItemBarang(
      "faktur",
      req.params.faktur,
      true
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `${req.params.faktur}-${new Date().getTime()}.xlsx`
    );

    const xlsx = await TransaksiServiceFakturExcel(transaksi, pelanggan, items);
    await xlsx.write(res);
    return res.end();
  }
);

TransaksiControllers.post(
  "/report-excel",
  [
    UserServiceTokenAuthentication,
    TransaksiValidators.reporting.terms(),
    TransaksiValidators.reporting.startDate(),
    TransaksiValidators.reporting.endDate(),
    BaseValidatorRun(),
  ],
  async (req, res) => {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `Report Pembelian - ${req.body.startDate} sd ${req.body.endDate}.xlsx`
    );

    const results = await TransaksiServiceReport(
      req.body.startDate,
      req.body.endDate,
      req.body.terms
    );

    const xlsx = await TransaksiServiceReportExcel(results);
    await xlsx.write(res);
    return res.end();
  }
);

module.exports = PembelianControllers;
