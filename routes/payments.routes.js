const express = require('express');
var Sale = require('models/sales.model')
var Stock = require('models/stocks.model')
var User = require('models/user.model')
var Location = require('models/thrifter_location.model')
var AgentPackage = require("models/agent_agent_delivery.modal.js");
var Sent_package = require("models/package.modal.js");
var Doorstep_pack = require("models/doorStep_delivery.model");
var Track_door_step = require('models/door_step_package_track.model');
var Track_agent_packages = require('models/agent_package_track.model');
var Track_rent_a_shelf = require('models/rent_shelf_package_track.model');
var Track_rent_a_shelf = require('models/rent_shelf_package_track.model');
var Track_Erand = require('models/erand_package_track.model');
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
    const Logs = await MpesaLogs.find({
      MerchantRequestID: req.body.Body?.stkCallback?.MerchantRequestID
    })

    Logs.forEach(async (element) => {

      const Update = await MpesaLogs.findOneAndUpdate(
        {
          MerchantRequestID: element?.MerchantRequestID
        }, {
        log: JSON.stringify(req.body), ResultDesc: req.body.Body?.stkCallback?.ResultDesc,
        ResponseCode: req.body.Body?.stkCallback?.ResultCode,
        MpesaReceiptNumber: req.body.Body?.stkCallback?.CallbackMetadata?.Item[1]?.Value
      }, { new: true, useFindAndModify: false })

      const LogedMpesa = await MpesaLogs.findOne({ MerchantRequestID: Update?.MerchantRequestID })
      const paymentUser = await User.findById(LogedMpesa.user)
      console.log("LOG", LogedMpesa)
      let V = await Sent_package.findOne(
        {
          _id: LogedMpesa.package
        })

      if (req.body.Body?.stkCallback?.ResultCode === 0) {

        if (LogedMpesa.type === "doorstep") {

          if (LogedMpesa.payLater) {
            const UpdatePackage = await Door_step_Sent_package.findOneAndUpdate(
              {
                _id: LogedMpesa.doorstep_package
              }, {
              payment_status: 'paid',
              on_delivery_balance: 0,
            }, { new: true, useFindAndModify: false })
          }
          let narration = await Track_door_step.findOne({ package: LogedMpesa.doorstep_package })
          const UpdatePackage = await Door_step_Sent_package.findOneAndUpdate(
            {
              _id: LogedMpesa.doorstep_package
            }, {
            payment_status: 'paid',
            instant_bal: 0,
          }, { new: true, useFindAndModify: false })
          let new_description = [...narration?.descriptions, {
            time: Date.now(), desc: `Pkg paid for by ${paymentUser?.name} at  ${moment().format('YYYY-MM-DD')} awaiting drop off `
          }]
          console.log("Updated Pack", UpdatePackage)
          await Track_door_step.findOneAndUpdate({ package: LogedMpesa.doorstep_package }, {
            descriptions: new_description
          }, { new: true, useFindAndModify: false })

        }

        else if (LogedMpesa.type === "agent") {

          if (LogedMpesa.payLater) {
            await Sent_package.findOneAndUpdate(
              {
                _id: LogedMpesa.package
              }, {
              payment_status: 'paid',
              on_delivery_balance: 0,
            }, { new: true, useFindAndModify: false })
          }
          let narration = await Track_agent_packages.findOne({ package: LogedMpesa.package })
          await Sent_package.findOneAndUpdate(
            {
              _id: LogedMpesa.package
            }, {
            payment_status: 'paid',
            instant_bal: 0,
          }, { new: true, useFindAndModify: false })
          let new_description = [...narration?.descriptions, {
            time: Date.now(), desc: `Pkg paid for by ${paymentUser?.name} at  ${moment().format('YYYY-MM-DD')} awaiting drop off to sorting area`
          }]
          let Track = await Track_agent_packages.findOneAndUpdate({ package: LogedMpesa.package }, {
            descriptions: new_description
          }, { new: true, useFindAndModify: false })


        }
        else if (LogedMpesa.type === "courier") {
          if (LogedMpesa.payLater) {
            await Erand_package.findOneAndUpdate(
              {
                _id: LogedMpesa.errand_package
              }, {
              payment_status: 'paid',
              on_delivery_balance: 0,
            }, { new: true, useFindAndModify: false })
          }
          let narration = await Track_Erand.findOne({ package: LogedMpesa.errand_package })
          const UpdatePackage = await Erand_package.findOneAndUpdate(
            {
              _id: LogedMpesa.errand_package
            }, {
            payment_status: 'paid',
            instant_bal: 0,
          }, { new: true, useFindAndModify: false })
          let new_description = [...narration?.descriptions, {
            time: Date.now(), desc: `Pkg paid for by ${paymentUser?.name} at  ${moment().format('YYYY-MM-DD hh:mm')} awaiting drop off to sorting area`
          }]

          await Track_Erand.findOneAndUpdate({ package: LogedMpesa.errand_package }, {

            descriptions: new_description

          }, { new: true, useFindAndModify: false })
        }
        else if (LogedMpesa.type === "rent") {
          if (LogedMpesa.payLater) {
            await Rent_a_shelf_deliveries.findOneAndUpdate(
              {
                _id: LogedMpesa.rent_package
              }, {
              payment_status: 'paid',
              on_delivery_balance: 0,
            }, { new: true, useFindAndModify: false })
          }
          let narration = await Track_rent_a_shelf.findOne({ package: LogedMpesa.rent_package })
          const UpdatePackage = await Rent_a_shelf_deliveries.findOneAndUpdate(
            {
              _id: LogedMpesa.rent_package
            }, {
            payment_status: 'paid',
            instant_bal: 0,
          }, { new: true, useFindAndModify: false })
          let new_description = [...narration?.descriptions, {
            time: Date.now(), desc: `Pkg paid for by ${paymentUser?.name} at  ${moment().format('YYYY-MM-DD hh:mm')} awaiting drop off to sorting area`
          }]

          await Track_rent_a_shelf.findOneAndUpdate({ package: LogedMpesa.rent_package }, {

            descriptions: new_description

          }, { new: true, useFindAndModify: false })
        }
      }

    })
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
router.put("/package-payment/", [authMiddleware, authorized], async (req, res) => {
  try {

    await Mpesa_stk(req.body.payment_phone_number, req.body.payment_amount, req.user._id, req.body.type, req.body.packages, req.body.pay_on_delivery)
    return res
      .status(200)
      .json("paid");

  } catch (err) {
    console.log(err)
  }
})



module.exports = router;