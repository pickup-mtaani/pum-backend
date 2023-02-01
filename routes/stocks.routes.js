const express = require("express");
var Stock = require("models/stocks.model");
var Logs = require("models/logs.model");
var User = require("models/user.model");
var Product = require("models/products.model");
var Bussiness = require("models/business.model");
var Reject = require("models/reject_stocks.model");
var {
  authMiddleware,
  authorized,
} = require("middlewere/authorization.middlewere");
const { SendMessage } = require("../helpers/sms.helper");
const Format_phone_number = require("../helpers/phone_number_formater");
const router = express.Router();

router.post("/stock", [authMiddleware, authorized], async (req, res) => {
  try {
    console.log(req.body);
    const prod = await Product.findOne({
      _id: req.body.product,
      business: req.body.business,
    });

    const body = req.body;

    body.current_stock = prod.qty;
    body.createdBy = req.user._id;
    const newStock = new Stock(body);
    const saved = await newStock.save();
    await Product.findOneAndUpdate(
      { business: body.business, _id: body.product },
      { pending_stock_confirmed: false, pending_stock: body.qty },
      { new: true, useFindAndModify: false }
    );
    return res
      .status(200)
      .json({ message: "Stock Added successfully", saved: saved });
  } catch (error) {
    console.log("STOCKING ERROR: " + error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.post(
  "/approve-stock/:bussiness_id/:product_id",
  [authMiddleware, authorized],
  async (req, res) => {
    try {
      const prod = await Product.findOne({
        business: req.params.bussiness_id,
        _id: req.params.product_id,
      });
      console.log(prod);
      await Product.findOneAndUpdate(
        { business: req.params.bussiness_id, _id: req.params.product_id },
        {
          pending_stock_confirmed: true,
          pending_stock: 0,
          qty: parseInt(prod.qty + prod.pending_stock),
        },
        { new: true, useFindAndModify: false }
      );

      return res.status(200).json({ message: "Stock approved successfully" });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "operation failed ", error });
    }
  }
);

router.get(
  "/stocks/:bussiness_id",
  [authMiddleware, authorized],
  async (req, res) => {
    try {
      let current_stock = await Product.find({
        type: "in_store",
        business: req.params.bussiness_id,
        createdBy: req.user._id,
        qty: { $gt: 0 },
      });
      let out_of_stock = await Product.find({
        type: "in_store",
        business: req.params.bussiness_id,
        createdBy: req.user._id,
        qty: { $eq: 0 },
      });
      // let pending_stock = await Product.find({ business: req.params.bussiness_id, createdBy: req.user._id, pending_stock_confirmed: false, pending_stock: { $gt: 0 } })

      return res
        .status(200)
        .json({ current_stock: current_stock, out_of_stock: out_of_stock });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "operation failed ", error });
    }
  }
);
router.get(
  "/shelf-location-stocks/:agent",
  [authMiddleware, authorized],
  async (req, res) => {
    try {
      let current_stock = await Product.find({
        shelf_location: req.params.agent,
      });

      return res.status(200).json(current_stock);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "operation failed ", error });
    }
  }
);
router.get(
  "/stocks/shelf/:bussiness_id",
  [authMiddleware, authorized],
  async (req, res) => {
    try {
      let current_stock = await Product.find({
        type: "shelf",
        business: req.params.bussiness_id,
        createdBy: req.user._id,
        qty: { $gt: 0 },
      });
      let out_of_stock = await Product.find({
        type: "shelf",
        business: req.params.bussiness_id,
        createdBy: req.user._id,
        qty: { $eq: 0 },
        pending_stock: { $eq: 0 },
      });
      let pending_stock = await Product.find({
        type: "shelf",
        business: req.params.bussiness_id,
        createdBy: req.user._id,
        pending_stock_confirmed: false,
        pending_stock: { $gt: 0 },
      });

      return res
        .status(200)
        .json({
          current_stock: current_stock,
          out_of_stock: out_of_stock,
          pending_stock: pending_stock,
        });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "operation failed ", error });
    }
  }
);
router.post(
  "/reject-stock/:bussiness_id/:product_id",
  [authMiddleware, authorized],
  async (req, res) => {
    try {
      const business = await Bussiness.findById(
        req.params.bussiness_id
      ).populate("createdBy");

      const prod = await Product.findById(req.params.product_id);
      const body = req.body;
      body.business = req.params.bussiness_id;
      body.product = req.params.product_id;
      body.rejectedBy = req.user._id;

      const textbody = {
        address: Format_phone_number(`${business.createdBy.phone_number}`),
        Body: `Hello  ${business.name}, Kindly note that ${prod.product_name} has been rejected because ${body?.reason}
          `,
      };

      await Product.findOneAndUpdate(
        { business: req.params.bussiness_id, _id: req.params.product_id },
        { pending_stock_confirmed: true },
        { new: true, useFindAndModify: false }
      );

      await SendMessage(textbody);
      await new Reject(body).save();
      return res.status(200).json({ message: "Stock approved successfully" });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "operation failed ", error });
    }
  }
);

module.exports = router;
