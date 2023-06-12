const _ = require("lodash");
const { body } = require("express-validator");
const TransaksiServiceGet = require("./services/TransaksiServiceGet");
const BarangServiceGet = require("../barang/services/BarangServiceGet");
const BaseValidatorFields = require("../base/validators/BaseValidatorFields");
const BaseValidatorHandleUndefined = require("../base/validators/BaseValidatorHandleUndefined");
const PelangganValidators = require("../pelanggan/PelangganValidators");
const BarangValidators = require("../barang/BarangValidators");

const TransaksiValidators = {
  faktur: (location = body, forCreate = true, field = "no_faktur") => {
    return location(field)
      .notEmpty()
      .withMessage("No Faktur wajib diisi.")
      .bail()
      .trim()
      .custom(async (value) => {
        const transaksi = await TransaksiServiceGet("no_faktur", value);
        if (forCreate && transaksi) {
          return Promise.reject("Faktur transaksi sudah pernah dibuat.");
        } else if (!forCreate && !pembelian) {
          return Promise.reject("No Faktur Transaksi tidak ada.");
        }

        return Promise.resolve(true);
      });
  },
  tanggal: (location = body, field = "tanggal") => {
    return location(field)
      .notEmpty()
      .withMessage("Tanggal transaksi wajib")
      .bail()
      .trim();
  },
  kode_pelanggan: (location = body, field = "kode_pelanggan") => {
    return PelangganValidators.kode_pelanggan(location, false, field);
  },
  dibayar: (location = body, field = "dibayar") => {
    return location(field)
      .notEmpty()
      .withMessage("Dibayar wajib.")
      .bail()
      .isInt()
      .withMessage("Dibayar harus angka.")
      .bail()
      .customSanitizer((value) => parseInt(value))
      .custom((value, { req }) => {
        if (value < req.body.total) {
          throw new Error("Uang dibayar kurang.");
        }
        return true;
      });
  },
  kembali: (location = body, field = "kembali") => {
    return location(field)
      .notEmpty()
      .withMessage("Kembali wajib.")
      .bail()
      .isInt()
      .withMessage("Total harus angka.")
      .bail()
      .customSanitizer((value) => parseInt(value))
      .custom((value, { req }) => {
        const calculateKembali = req.body.dibayar - req.body.total;
        if (calculateKembali < 0) {
          throw new Error("Uang kembalian tidak boleh minus.");
        } else if (calculateKembali !== value) {
          throw new Error("Uang kembalian tidak valid.");
        }

        return true;
      });
  },
  items: {
    self: (location = body, field = "items") => {
      return location(field)
        .notEmpty()
        .withMessage("Item Transaksi wajib.")
        .bail()
        .isArray({ min: 1 })
        .withMessage(
          "Item harus berupa array dan minimal 1 barang di dalamnya."
        );
    },
    inner: {
      kode_barang: (location = body, field = "items.*.kode_barang") => {
        return BarangValidators.kode_barang(location, false, field);
      },
      nama_barang: (location = body, field = "items.*.nama_barang") => {
        return BarangValidators.nama_barang(location, field)
          .bail()
          .custom(async (value, { req, location, path }) => {
            const index = _.toPath(path)[1];
            const barang = await BarangServiceGet(
              "kode_barang",
              req[location].items[index].kode_barang
            );

            BaseValidatorHandleUndefined(barang, "Kode Barang");

            if (barang.nama_barang !== value) {
              throw new Error(
                "Nama barang tidak sama dengan nama barang aslinya."
              );
            }
          });
      },

      qty: (location = body, field = "items.*.qty") => {
        return location(field)
          .notEmpty()
          .withMessage("qty wajib.")
          .bail()
          .customSanitizer((value) => parseInt(value))
          .custom((value) => {
            if (value <= 0) {
              throw new Error("Nilai qty tidak boleh 0 atau dibawahnya.");
            }
            return true;
          })
          .bail()
          .custom(async (value, { req, location, path }) => {
            const index = _.toPath(path)[1];
            const barang = await BarangServiceGet(
              "kode_barang",
              req[location].items[index].kode_arang
            );

            BaseValidatorHandleUndefined(barang, "Kode Barang");

            const calculateQty =
              barang.dibayar * req[location].items[index].kembali;
            if (calculateSubtotal !== value) {
              return Promise.reject("qty tidak valid.");
            }

            return Promise.resolve(true);
          });
      },
    },
  },
  total: (location = body, field = "total") => {
    return location(field)
      .notEmpty()
      .withMessage("Jumlah beli wajib.")
      .bail()
      .isInt()
      .withMessage("Total harus angka.")
      .bail()
      .customSanitizer((value) => parseInt(value))
      .custom((value) => {
        if (value <= 0) {
          throw new Error("Total tidak boleh bernilai 0 atau di bawahnya.");
        }
        return true;
      })
      .custom((value, { req }) => {
        let total = 0;
        for (const item of req.body.items) {
          total = total + item.qty;
        }

        if (total !== value) {
          throw new Error("Total tidak valid.");
        }

        return true;
      });
  },
  reporting: {
    terms: (location = body, field = "terms") => {
      return BaseValidatorFields.terms(location, field);
    },
    startDate: (location = body, field = "startDate") => {
      return location(field)
        .notEmpty()
        .withMessage("Start date wajib diisi.")
        .bail()
        .isDate()
        .withMessage("Start date tidak valid.");
    },
    endDate: (location = body, field = "endDate") => {
      return location(field)
        .notEmpty()
        .withMessage("End date wajib diisi.")
        .bail()
        .isDate()
        .withMessage("End date tidak valid.");
    },
  },
};

module.exports = TransaksiValidators;
