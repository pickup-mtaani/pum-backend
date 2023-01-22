const express = require('express');
var Sale = require('models/sales.model')
var Stock = require('models/stocks.model')
var User = require('models/user.model')
var Sale = require('models/sales.model')
const mpesa_logsModel = require('models/mpesa_logs.model')
var Location = require('models/thrifter_location.model')
var Rent_a_shelf_deliveries = require("models/rent_a_shelf_deliveries");
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
  try {
    const mpeslog = await MpesaLogs.find().populate('user', 'name').sort({ createdAt: -1 })
      .limit(10)

    return res.status(200).json(mpeslog);
  } catch (error) {
    console.log(error)
  }

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
      // console.log("LOG", LogedMpesa)


      let package

      if (req.body.Body?.stkCallback?.ResultCode === 0) {

        if (LogedMpesa.type === "doorstep") {
          package = await Door_step_Sent_package.findOne(
            {
              _id: LogedMpesa.doorstep_package
            }).populate("createdBy")
          if (package.state === "request") {
            await Door_step_Sent_package.findOneAndUpdate(
              {
                _id: LogedMpesa.doorstep_package
              }, {
              payment_status: 'paid',
              instant_bal: 0,
            }, { new: true, useFindAndModify: false })
            let narration = await Track_door_step.findOne({ package: LogedMpesa.doorstep_package })
            let new_description = [...narration?.descriptions, {
              time: Date.now(), desc: `Pkg paid for by ${package?.createdBy?.name} at  ${moment().format('YYYY-MM-DD')} awaiting drop off `
            }]

            await Track_door_step.findOneAndUpdate({ package: LogedMpesa.doorstep_package }, {
              descriptions: new_description
            }, { new: true, useFindAndModify: false })
          } else {
            await Door_step_Sent_package.findOneAndUpdate(
              {
                _id: LogedMpesa.doorstep_package
              }, {
              payment_status: 'paid',
              on_delivery_balance: 0,
            }, { new: true, useFindAndModify: false })
            let narration = await Track_door_step.findOne({ package: LogedMpesa.doorstep_package })

            let new_description = [...narration?.descriptions, {
              time: Date.now(), desc: `Pkg paid for by ${package?.customerName} at  ${moment().format('YYYY-MM-DD')} awaiting drop off `
            }]

            await Track_door_step.findOneAndUpdate({ package: LogedMpesa.doorstep_package }, {
              descriptions: new_description
            }, { new: true, useFindAndModify: false })
          }


        }

        else if (LogedMpesa.type === "agent") {
          let Packages = await Sent_package.find(
            {
              _id: LogedMpesa.package
            })

          Packages.forEach(async (element) => {
            console.log("Elemrnt", element.receipt_no)
            package = await Sent_package.findOne(
              {
                _id: element._id
              }).populate('createdBy')
            if (package.state === "request") {
              let narration = await Track_agent_packages.findOne({ package: element._id })
              await Sent_package.findOneAndUpdate(
                {
                  _id: element._id
                }, {
                payment_status: 'paid',
                instant_bal: 0,
              }, { new: true, useFindAndModify: false })
              let new_description = [...narration?.descriptions, {
                time: Date.now(), desc: `Pkg paid for by ${package?.createdBy?.name} at  ${moment().format('YYYY-MM-DD')} awaiting drop off to sorting area`
              }]
              let Track = await Track_agent_packages.findOneAndUpdate({ package: element._id }, {
                descriptions: new_description
              }, { new: true, useFindAndModify: false })

            }
            else {
              let narration = await Track_agent_packages.findOne({ package: element._id })
              await Sent_package.findOneAndUpdate(
                {
                  _id: element._id
                }, {
                payment_status: 'paid',
                on_delivery_balance: 0,
              }, { new: true, useFindAndModify: false })
              let new_description = [...narration?.descriptions, {
                time: Date.now(), desc: `Pkg paid for by ${package?.customerName} at  ${moment().format('YYYY-MM-DD')} awaiting drop off to sorting area`
              }]
              let Track = await Track_agent_packages.findOneAndUpdate({ package: element._id }, {
                descriptions: new_description
              }, { new: true, useFindAndModify: false })

            }
          })



        }
        else if (LogedMpesa.type === "courier") {
          package = await Erand_package.findOne(
            {
              _id: LogedMpesa.errand_package
            }).populate('createdBy')


          let narration = await Track_Erand.findOne({ package: LogedMpesa.errand_package })
          await Erand_package.findOneAndUpdate(
            {
              _id: LogedMpesa.errand_package
            }, {
            payment_status: 'paid',
            instant_bal: 0,
          }, { new: true, useFindAndModify: false })

          let new_description = [...narration?.descriptions, {
            time: Date.now(), desc: `Pkg paid for by ${package?.createdBy?.name} at  ${moment().format('YYYY-MM-DD hh:mm')} awaiting drop off to sorting area`
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

          let new_description = [...narration?.descriptions, {
            time: Date.now(), desc: `Pkg paid for by ${package?.customerName} at  ${moment().format('YYYY-MM-DD hh:mm')} awaiting drop off to sorting area`
          }]

          await Track_rent_a_shelf.findOneAndUpdate({ package: LogedMpesa.rent_package }, {

            descriptions: new_description

          }, { new: true, useFindAndModify: false })
        }
        else if (LogedMpesa.type === "sale") {
          if (LogedMpesa.payLater) {
            await Sale.findOneAndUpdate(
              {
                _id: LogedMpesa.sale
              }, {
              payment_status: true
            }, { new: true, useFindAndModify: false })
          }

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

async function subscribe(result) {
  console.log("Subscribe")

  await new Promise(resolve => setTimeout(resolve, 2000));
  response = await mpesa_logsModel.findOne({ MerchantRequestID: result.MerchantRequestID })
  console.log("REs", response)
  if (response.log === "") {
    // / An error - let's show it
    // showMessage(response.statusText);
    // Reconnect in one second

    console.log("Not yet")
    await subscribe(result);
    // await subscribe();

  } else {
    console.log("paid")
    result = {
      message: "Mpesa transaction complete"
    }
    return res
      .status(200)
      .json("response");
  }

  // await subscribe(result);

}
router.put("/package-payment/", [authMiddleware, authorized], async (req, res) => {
  try {

    let result = await Mpesa_stk(req.body.payment_phone_number, req.body.payment_amount, req.user._id, req.body.type, req.body.packages, req.body.pay_on_delivery)
    // let success = await mpesa_logsModel.findOne({ MerchantRequestID: result.MerchantRequestID })
    // console.log(result.MerchantRequestID)
    // await new Promise(resolve => setTimeout(resolve, 500));

    // await subscribe(result)
    return res
      .status(200)
      .json(result);


  } catch (err) {

    console.log(err)
  }
})

router.post("/sales-pay/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    // let v = await Mpesa_stk(req.body.phone_number, 1)
    await Mpesa_stk(req.body.payment_phone_number, req.body.payment_amount, req.user._id, req.body.type, req.body.packages, req.body.pay_on_delivery, req.query.param)

    // await Sale.findOneAndUpdate({ _id: req.params.id }, { payment_status: true }, { new: true, useFindAndModify: false })
    return res
      .status(200)
      .json({});
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});




module.exports = router;