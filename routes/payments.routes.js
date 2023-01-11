const express = require('express');
var Sale = require('models/sales.model')
var Stock = require('models/stocks.model')
var User = require('models/user.model')
var Location = require('models/thrifter_location.model')
var AgentPackage = require("models/agent_agent_delivery.modal.js");
var Sent_package = require("models/package.modal.js");
var Doorstep_pack = require("models/doorStep_delivery.model");
var Door_step_Sent_package = require("models/doorStep_delivery_packages.model");
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
var Erand_package = require("models/erand_delivery_packages.model");
const router = express.Router();
var fetch = require('node-fetch')
var axios = require('axios')
var Customer = require("models/customer.model");
var Product = require('models/products.model')
var Bussiness = require('models/business.model')
var moment = require('moment')
var { Headers } = fetch
const { SendMessage } = require('../helpers/sms.helper');
var MpesaLogs = require("../models/mpesa_logs.model");
const Mpesa_stk = require('../helpers/stk_push.helper');
router.get('/mpesa-payments', async (req, res, next) => {
  const mpeslog = await MpesaLogs.find().populate('user')
  return res.status(200).json({ success: true, message: `payments feched`, mpeslog });
})

router.post('/CallbackUrl', async (req, res, next) => {


  try {

    const Update = await MpesaLogs.findOneAndUpdate(
      {
        MerchantRequestID: req.body.Body?.stkCallback?.MerchantRequestID
      }, {
      log: JSON.stringify(req.body), ResultDesc: req.body.Body?.stkCallback?.ResultDesc,
      ResponseCode: req.body.Body?.stkCallback?.ResultCode,
      MpesaReceiptNumber: req.body.Body?.stkCallback?.CallbackMetadata?.Item[1]?.Value
    }, { new: true, useFindAndModify: false })

    const LogedMpesa = await MpesaLogs.findOne({ MerchantRequestID: Update?.MerchantRequestID })
    // console.log("****************************************************************")
    // console.log("Mpesa Body", LogedMpesa.package, LogedMpesa.type)
    // console.log("****************************************************************")
    console.log("Update Request", JSON.stringify(req.body))
    let V = await Sent_package.findOne(
      {
        _id: LogedMpesa.package
      })
    console.log("***************************Village *************************************")
    console.log("PAID", req.body.Body?.stkCallback?.ResultDesc)
    // console.log("Mpesa Body", LogedMpesa.package, LogedMpesa.type, V)
    if (LogedMpesa.type === "doorstep") {

      const UpdatePackage = await Door_step_Sent_package.findOneAndUpdate(
        {
          _id: LogedMpesa.doorstep_package
        }, {
        payment_status: req.body.Body?.stkCallback?.ResultDesc,
      }, { new: true, useFindAndModify: false })
    }
    else if (LogedMpesa.type === "agent") {

      const UpdatePackage = await Sent_package.findOneAndUpdate(
        {
          _id: LogedMpesa.package
        }, {
        payment_status: req.body.Body?.stkCallback?.ResultDesc,
      }, { new: true, useFindAndModify: false })

      console.log("*************************Update Package***************************************")
      console.log("Update Request", UpdatePackage)

    }
    else if (LogedMpesa.type === "errand") {

      const UpdatePackage = await Erand_package.findOneAndUpdate(
        {
          _id: LogedMpesa.errand_package
        }, {
        payment_status: req.body.Body?.stkCallback?.ResultDesc,
      }, { new: true, useFindAndModify: false })
    }

    return res.status(200).json({ success: true, message: `payments made successfully`, body: req.body });
  } catch (error) {
    console.log(error)
  }
})
router.put("/agent/toogle-payment/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    let paid = await Sent_package.findOneAndUpdate({ _id: req.params.id }, { payment_status: "paid" }, { new: true, useFindAndModify: false })
    return res
      .status(200)
      .json(paid);

  } catch (err) {
    console.log(err)
  }
})
router.put("/package-payment/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    await Mpesa_stk(req.body.payment_phone_number, req.body.payment_amount, req.user._id, "agent", req.params.id)
    return res
      .status(200)
      .json("paid");

  } catch (err) {
    console.log(err)
  }
})



module.exports = router;