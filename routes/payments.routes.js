const express = require("express");
var Sale = require("models/sales.model");
var Stock = require("models/stocks.model");
var User = require("models/user.model");
var Sale = require("models/sales.model");
const mpesa_logsModel = require("models/mpesa_logs.model");
var Location = require("models/thrifter_location.model");
var Rent_a_shelf_deliveries = require("models/rent_a_shelf_deliveries");
var AgentPackage = require("models/agent_agent_delivery.modal.js");
var Sent_package = require("models/package.modal.js");

var Track_door_step = require("models/door_step_package_track.model");
var Track_agent_packages = require("models/agent_package_track.model");
var Track_rent_a_shelf = require("models/rent_shelf_package_track.model");
var Track_rent_a_shelf = require("models/rent_shelf_package_track.model");
var Track_Erand = require("models/erand_package_track.model");
var Door_step_Sent_package = require("models/doorStep_delivery_packages.model");
var {
  authMiddleware,
  authorized,
} = require("middlewere/authorization.middlewere");
var Erand_package = require("models/erand_delivery_packages.model");
const router = express.Router();
var fetch = require("node-fetch");
var axios = require("axios");
var Customer = require("models/customer.model");
var Product = require("models/products.model");
var Bussiness = require("models/business.model");
var moment = require("moment");
var { Headers } = fetch;
const { SendMessage } = require("../helpers/sms.helper");
var MpesaLogs = require("../models/mpesa_logs.model");
const Mpesa_stk = require("../helpers/stk_push.helper");
const handleTransactionQuery = require("../helpers/TransactionQuery");
router.get("/mpesa-payments", async (req, res, next) => {
  try {
    const { type } = req.query;

    let Logs = await MpesaLogs.find({ type: "doorstep" })
      .populate("user", "name")
      .populate("doorstep_package", "receipt_no")
      .sort({ createdAt: -1 })
      .limit(100);

    if (type === "doorstep") {
      Logs = await MpesaLogs.find({ type: "doorstep" })
        .populate("user", "name")
        .populate("doorstep_package", "receipt_no")
        .sort({ createdAt: -1 })
        .limit(100);
    } else if (type === "agent") {
      Logs = await MpesaLogs.find({ type: "agent" })
        .populate("user", "name")
        .populate("package", "receipt_no")
        .sort({ createdAt: -1 })
        .limit(100);
      // console.log("first", Logs);
    } else if (type === "courier") {
      Logs = await MpesaLogs.find({ type: "courier" })
        .populate("user", "name")
        .populate("errand_package", "receipt_no")
        .sort({ createdAt: -1 })
        .limit(100);
    } else if (type === "rent") {
      Logs = await MpesaLogs.find({ type: "rent" })
        .populate("user", "name")
        .populate("rent_package", "receipt_no")
        .sort({ createdAt: -1 })
        .limit(100);
    } else {
      Logs = await MpesaLogs.find({ type: "sale" })
        .populate("user", "name")
        .populate("sale", "receipt_no")
        .sort({ createdAt: -1 })
        .limit(100);
    }

    return res.status(200).json(Logs);
  } catch (error) {
    console.log(error);
  }
});

router.post("/CallbackUrl", async (req, res, next) => {
  try {
    console.log(req?.body?.Body);
    const Logs = await MpesaLogs.find({
      MerchantRequestID: req.body.Body?.stkCallback?.MerchantRequestID,
    });
    for (let i = 0; i < Logs.length; i++) {
      await MpesaLogs.findOneAndUpdate(
        {
          _id: Logs[i]._id,
        },
        {
          log: JSON.stringify(req.body),
          ResultDesc: req.body.Body?.stkCallback?.ResultDesc,
          ResponseCode: req.body.Body?.stkCallback?.ResultCode,
          MpesaReceiptNumber:
            req.body.Body?.stkCallback?.CallbackMetadata?.Item[1]?.Value,
        },
        { new: true, useFindAndModify: false }
      );

      if (Number(req.body.Body?.stkCallback?.ResultCode) === 0) {
        if (Logs[i].type === "agent") {
          package = await Sent_package.findOne({
            _id: Logs[i].package,
          }).populate("createdBy");

          if (package.state === "request") {
            let narration = await Track_agent_packages.findOne({
              package: Logs[i].package,
            });
            let u = await Sent_package.findOneAndUpdate(
              {
                _id: Logs[i].package,
              },
              {
                payment_status: "paid",
                instant_bal: 0,
              },
              { new: true, useFindAndModify: false }
            );

            let new_description = [
              ...narration?.descriptions,
              {
                time: Date.now(),
                desc: `Pkg paid for by ${
                  package?.createdBy?.name
                } at  ${moment().format(
                  "YYYY-MM-DD"
                )} awaiting drop off to sorting area`,
              },
            ];
            let Track = await Track_agent_packages.findOneAndUpdate(
              { package: Logs[i].package },
              {
                descriptions: new_description,
              },
              { new: true, useFindAndModify: false }
            );
          } else {
            let narration = await Track_agent_packages.findOne({
              package: Logs[i].package,
            });
            let v = await Sent_package.findOneAndUpdate(
              {
                _id: Logs[i].package,
              },
              {
                payment_status: "paid",
                on_delivery_balance: 0,
              },
              { new: true, useFindAndModify: false }
            );
            console.log("V on request", v, package.state);
            let new_description = [
              ...narration?.descriptions,
              {
                time: Date.now(),
                desc: `Pkg paid for by ${
                  package?.customerName
                } at  ${moment().format(
                  "YYYY-MM-DD"
                )} awaiting drop off to sorting area`,
              },
            ];
            let Track = await Track_agent_packages.findOneAndUpdate(
              { package: Logs[i].package },
              {
                descriptions: new_description,
              },
              { new: true, useFindAndModify: false }
            );
          }
        } else if (Logs[i].type === "doorstep") {
          let dpackage = await Door_step_Sent_package.findOne({
            _id: Logs[i].doorstep_package,
          }).populate("createdBy");

          if (dpackage.state === "request") {
            let v = await Door_step_Sent_package.findOneAndUpdate(
              {
                _id: Logs[i].doorstep_package,
              },
              {
                payment_status: "paid",
                instant_bal: 0,
              },
              { new: true, useFindAndModify: false }
            );
            let narration = await Track_door_step.findOne({
              package: Logs[i].doorstep_package,
            });
            let new_description = [
              ...narration?.descriptions,
              {
                time: Date.now(),
                desc: `Pkg paid for by ${
                  dpackage?.createdBy?.name
                } at  ${moment().format("YYYY-MM-DD")} awaiting drop off `,
              },
            ];

            await Track_door_step.findOneAndUpdate(
              { package: Logs[i].doorstep_package },
              {
                descriptions: new_description,
              },
              { new: true, useFindAndModify: false }
            );
          } else {
            let v = await Door_step_Sent_package.findOneAndUpdate(
              {
                _id: Logs[i].doorstep_package,
              },
              {
                payment_status: "paid",
                on_delivery_balance: 0,
              },
              { new: true, useFindAndModify: false }
            );
            let narration = await Track_door_step.findOne({
              package: Logs[i].doorstep_package,
            });

            let new_description = [
              ...narration?.descriptions,
              {
                time: Date.now(),
                desc: `Pkg paid for by ${
                  dpackage?.customerName
                } at  ${moment().format("YYYY-MM-DD")} awaiting drop off `,
              },
            ];

            await Track_door_step.findOneAndUpdate(
              { package: Logs[i].doorstep_package },
              {
                descriptions: new_description,
              },
              { new: true, useFindAndModify: false }
            );
          }
        } else if (Logs[i].type === "courier" || Logs[i].type === "courier") {
          let Courierpackage = await Erand_package.findOne({
            _id: Logs[i].errand_package,
          }).populate("createdBy");

          let narration = await Track_Erand.findOne({
            Courierpackage: Logs[i].errand_package,
          });
          await Erand_package.findOneAndUpdate(
            {
              _id: Logs[i].errand_package,
            },
            {
              payment_status: "paid",
              instant_bal: 0,
            },
            { new: true, useFindAndModify: false }
          );

          let new_description = [
            ...narration?.descriptions,
            {
              time: Date.now(),
              desc: `Pkg paid for by ${
                Courierpackage?.createdBy?.name
              } at  ${moment().format(
                "YYYY-MM-DD hh:mm"
              )} awaiting drop off to sorting area`,
            },
          ];

          await Track_Erand.findOneAndUpdate(
            { package: Logs[i].errand_package },
            {
              descriptions: new_description,
            },
            { new: true, useFindAndModify: false }
          );
        } else if (Logs[i].type === "rent") {
          if (Logs[i].payLater) {
            await Rent_a_shelf_deliveries.findOneAndUpdate(
              {
                _id: Logs[i].rent_package,
              },
              {
                payment_status: "paid",
                on_delivery_balance: 0,
              },
              { new: true, useFindAndModify: false }
            );
          }
          let narration = await Track_rent_a_shelf.findOne({
            package: Logs[i].rent_package,
          });

          let new_description = [
            ...narration?.descriptions,
            {
              time: Date.now(),
              desc: `Pkg paid for by ${
                package?.customerName
              } at  ${moment().format(
                "YYYY-MM-DD hh:mm"
              )} awaiting drop off to sorting area`,
            },
          ];

          await Track_rent_a_shelf.findOneAndUpdate(
            { package: Logs[i].rent_package },
            {
              descriptions: new_description,
            },
            { new: true, useFindAndModify: false }
          );
        } else if (Logs[i].type === "sale") {
          if (Logs[i].payLater) {
            await Sale.findOneAndUpdate(
              {
                _id: Logs[i].sale,
              },
              {
                payment_status: true,
              },
              { new: true, useFindAndModify: false }
            );
          }
        }
      } else {
        return res.status(400).json({
          success: false,
          message: req.body.Body?.stkCallback?.ResultDesc,
          body: {},
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `payments made successfully`,
      body: req.body,
    });
  } catch (error) {
    console.log(error);
  }
});

router.put(
  "/agent/toogle-payment/:id",
  [authMiddleware, authorized],
  async (req, res) => {
    try {
      let paid = await Sent_package.findOneAndUpdate(
        { _id: req.params.id },
        { payment_status: "paid" },
        { new: true, useFindAndModify: false }
      );
      return res.status(200).json(paid);
    } catch (err) {
      console.log(err);
    }
  }
);

async function subscribe(result) {
  // console.log("Subscribe");

  await new Promise((resolve) => setTimeout(resolve, 3000));
  let response = await mpesa_logsModel.find({
    MerchantRequestID: result.MerchantRequestID,
  });

  if (response[0].log === "") {
    // console.log("Not yet");
    await subscribe(result);
  } else {
    // console.log("paid");

    return true;
  }

  // await subscribe(result);
}
// make doorstep/agent/errand package payment on (signout/delivery)
router.put(
  "/package-payment/",
  [authMiddleware, authorized],
  async (req, res) => {
    try {
      let result = await Mpesa_stk(
        req.body?.payment_phone_number,
        req.body?.payment_amount,
        req.user._id,
        req.body?.type,
        req.body?.packages,
        req.body?.pay_on_delivery,
        req.body?.business,
        ""
      );
      await subscribe(result);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
    }
  }
);

router.post(
  "/sales-pay/:id",
  [authMiddleware, authorized],
  async (req, res) => {
    try {
      // let v = await Mpesa_stk(req.body.phone_number, 1)
      await Mpesa_stk(
        req.body.payment_phone_number,
        req.body.payment_amount,
        req.user._id,
        req.body.type,
        req.body.packages,
        req.body.pay_on_delivery,
        req.query.param,
        req.body?.business
      );

      // await Sale.findOneAndUpdate({ _id: req.params.id }, { payment_status: true }, { new: true, useFindAndModify: false })
      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "operation failed ", error });
    }
  }
);

router.post("/transaction_query", async (req, res) => {
  try {
    const status = await handleTransactionQuery({
      transactionId: req.body?.qid,
    });

    if (status?.successful) {
      return res.status(200).json(status);
    } else {
      return res.status(400).json(status);
    }
  } catch (error) {
    console.log("MAIN URL ERROR: ", error);
    return res
      .status(400)
      .json({ message: "Transaction Query error.", error: error?.message });
  }
});

router.post("/transaction_query_callback", async (req, res) => {
  try {
    console.log("TRANSACTION QUERY RESPONSE:", req.body);

    res.json(req.body).status(200);
  } catch (error) {
    console.log("CALL BACK ERROR: ", error);
  }
});

router.post("/transaction_timeout_callback", async (req, res) => {
  try {
    console.log("TRANSACTION QUERY TIMEOUT:", req.body);

    res.json(req.body).status(200);
  } catch (error) {
    console.log("ERROR: ", error?.message);
  }
});
// CHECK TRANSACTION STATUS

module.exports = router;
