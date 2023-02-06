const router = require("express").Router();
var _ = require("lodash");

const {
  authMiddleware,
  authorized,
} = require("middlewere/authorization.middlewere");
var MpesaLogs = require("../models/mpesa_logs.model");
var AgentPackages = require("../models/package.modal.js");
var DoorstepPackages = require("../models/doorStep_delivery_packages.model");
var ShelfPackages = require("../models/rent_a_shelf_deliveries");
var B2CHandler = require("../helpers/withdrawal.helper");
var WithdrawalModel = require("../models/withdraws.model");
const { default: ShortUniqueId } = require("short-unique-id");

router.get(
  "/receieved/:b_id",
  [authMiddleware, authorized],
  async (req, res) => {
    try {
      const { b_id } = req.params;
      if (!b_id) {
        res.status(400).json({ success: false, message: "Business required" });
      } else {
        const receieved_payments = await MpesaLogs.find({
          business: b_id,
          withdrawn: "false",
          payLater: "true",
          ResponseCode: 0,
        })
          ?.select(
            "package rent_package doorstep_package amount type updatedAt createdAt"
          )
          ?.populate({
            path: "package",
            select: "customerName type receipt_no  on_delivery_balance",
          })
          ?.populate({
            path: "rent_package",
            select: "customerName receipt_no  on_delivery_balance",
          })
          ?.populate({
            path: "doorstep_package",
            select: "customerName receipt_no on_delivery_balance",
          });

        const totalPayment = _.sum(_.map(receieved_payments, "amount"));

        res.status(200).json({
          count: receieved_payments?.length,
          total_payment: totalPayment,
          payments: receieved_payments,
        });
      }
    } catch (error) {
      console.log("RECEIEVED WITHDRAWALS ERROR: ", error);
      res.status(400).json({ success: false, message: error?.message, error });
    }
  }
);

router.get("/pending/:b_id", [authMiddleware, authorized], async (req, res) => {
  try {
    const { b_id } = req.params; //business id
    if (!b_id) {
      res.status(400).json({ success: false, message: "Business required" });
    } else {
      const pending_doorstep = await DoorstepPackages.find({
        businessId: b_id,
        payment_option: "collection",
        on_delivery_balance: { $gt: 0 },
      }).select(
        "customerName type receipt_no updatedAt createdAt on_delivery_balance"
      );
      const pending_agent = await AgentPackages.find({
        businessId: b_id,
        payment_option: "collection",
        on_delivery_balance: { $gt: 0 },
      }).select(
        "customerName type receipt_no updatedAt createdAt on_delivery_balance"
      );
      const pending_shelf = await ShelfPackages.find({
        businessId: b_id,
        payment_option: "collection",
        on_delivery_balance: { $gt: 0 },
      }).select(
        "customerName type receipt_no updatedAt createdAt on_delivery_balance"
      );

      const packageList = _.sortBy(
        [...pending_doorstep, ...pending_agent, ...pending_shelf],
        function (o) {
          return new Date(o.updatedAt);
        }
      ).reverse();

      res
        .status(200)
        .json({ count: packageList?.length, packages: packageList });
    }
  } catch (error) {
    console.log("PENDING WITHDRAWALS ERROR: ", error);
    res.status(400).json({ success: false, message: error?.message, error });
  }
});

router.get(
  "/unsuccessful/:b_id",
  [authMiddleware, authorized],
  async (req, res) => {
    try {
      const { b_id } = req.params; //business id
      if (!b_id) {
        res.status(400).json({ success: false, message: "Business required" });
      } else {
        const pending_doorstep = await DoorstepPackages.find({
          businessId: b_id,
          payment_option: "collection",
          state: "rejected",
          on_delivery_balance: { $gt: 0 },
        }).select(
          "customerName type receipt_no updatedAt createdAt on_delivery_balance"
        );
        const pending_agent = await AgentPackages.find({
          businessId: b_id,
          payment_option: "collection",
          state: "rejected",
          on_delivery_balance: { $gt: 0 },
        }).select(
          "customerName type receipt_no updatedAt createdAt on_delivery_balance"
        );
        const pending_shelf = await ShelfPackages.find({
          businessId: b_id,
          payment_option: "collection",
          state: "rejected",
          on_delivery_balance: { $gt: 0 },
        }).select(
          "customerName type receipt_no updatedAt createdAt on_delivery_balance"
        );

        const packageList = _.sortBy(
          [...pending_doorstep, ...pending_agent, ...pending_shelf],
          function (o) {
            return new Date(o.updatedAt);
          }
        ).reverse();

        res
          .status(200)
          .json({ count: packageList?.length, packages: packageList });
      }
    } catch (error) {
      console.log("UNSUCCESSFUL WITHDRAWALS ERROR: ", error);
      res.status(400).json({ success: false, message: error?.message, error });
    }
  }
);

// Transaction withdrawals
router.post("/callback", async (req, res) => {
  try {
    console.log(
      "072: WITHDRAWAL CALLBACK RESPONSE: ",
      JSON.stringify(req?.body)
    );

    // const currentWithdrawal = await WithdrawalModel.find({
    //     MerchantRequestID: req.body.Body?.stkCallback?.MerchantRequestID,
    // });

    // await WithdrawalModel.findOneAndUpdate(
    //     {
    //       _id: Logs[i]._id,
    //     },
    //     {O
    //       log: JSN.stringify(req.body),
    //       ResultDesc: req.body.Body?.stkCallback?.ResultDesc,
    //       ResponseCode: req.body.Body?.stkCallback?.ResultCode,
    //       MpesaReceiptNumber:
    //         req.body.Body?.stkCallback?.CallbackMetadata?.Item[1]?.Value,
    //     },
    //     { new: true, useFindAndModify: false }
    //   );
    // res.status(200).json();
  } catch (error) {
    console.log("MPESA WITHDRAWALS CALLBACK ERROR: ", error);
  }
});

router.post("/queuetimeouturl", async (req, res) => {
  try {
    console.log("160: WITHDRAWAL QUEUE TIMEOUT RESPONSE: ", req?.body);

    // const currentWithdrawal = await WithdrawalModel.find({
    //     MerchantRequestID: req.body.Body?.stkCallback?.MerchantRequestID,
    // });

    // await WithdrawalModel.findOneAndUpdate(
    //     {
    //       _id: Logs[i]._id,
    //     },
    //     {O
    //       log: JSN.stringify(req.body),
    //       ResultDesc: req.body.Body?.stkCallback?.ResultDesc,
    //       ResponseCode: req.body.Body?.stkCallback?.ResultCode,
    //       MpesaReceiptNumber:
    //         req.body.Body?.stkCallback?.CallbackMetadata?.Item[1]?.Value,
    //     },
    //     { new: true, useFindAndModify: false }
    //   );
    res.status(200).json();
  } catch (error) {
    console.log("MPESA WITHDRAWALS CALLBACK ERROR: ", error);
  }
});

async function subscribe(result) {
  // console.log("Subscribe");

  await new Promise((resolve) => setTimeout(resolve, 3000));
  let response = await WithdrawalModel.find({
    ConversationID: result.ConversationID,
  });

  // if (response[0].log === "") {
  //   // console.log("Not yet");
  //   await subscribe(result);
  // } else {
  //   // console.log("paid");

  //   return true;
  // }
  return true;
  // await subscribe(result);
}

router.post(
  "/withdraw/:w_id",
  [authMiddleware, authorized],
  async (req, res) => {
    try {
      //w_id is the withdrawal id
      // console.log("WITHDRAWAL: ", req.body);

      let result = await B2CHandler(
        req?.body?.amount,
        req.body?.phone_number,
        req.params?.w_id
      );

      await subscribe(result);
      // await new Promise((resolve) => setTimeout(resolve, 500));
      return res.status(200).json(result);
    } catch (error) {
      console.log("MPESA WITHDRAWALS CALLBACK ERROR: ", error);
    }
  }
);

// request withdrawal by seller
router.post("/request", [authMiddleware, authorized], async (req, res) => {
  try {
    const uid = new ShortUniqueId({ length: 10 });

    const packages = req.body?.packages;

    packages?.forEach(async (p) => {
      // find mpesa model and update withdrawal status.
      let currentLog;
      if (p?.del_type === "agent") {
        currentLog = await MpesaLogs.findOneAndUpdate(
          { package: p?._id, ResponseCode: 0 },
          { withdrawn: "pending" }
        );
      } else if (p?.del_type === "doorstep") {
        currentLog = await MpesaLogs.findOneAndUpdate(
          { doorstep_package: p?._id, ResponseCode: 0 },
          { withdrawn: "pending" }
        );
      } else if (p?.del_type === "rent" || p?.del_type === "") {
        currentLog = await MpesaLogs.findOneAndUpdate(
          { rent_package: p?._id, ResponseCode: 0 },
          { withdrawn: "pending" }
        );
      }
      console.log(p?.del_type, " : ", currentLog);
    });

    let result = await new WithdrawalModel({
      amount: req?.body?.amount,
      phone: req.body?.phone_number,
      user: req.user?._id,
      packages: req.body?.packages,
      business: req.body?.business,
      status: "pending",
      code: uid(),
    }).save();
    // await new Promise((resolve) => setTimeout(resolve, 500));
    return res.status(200).json(result);
  } catch (error) {
    console.log("MPESA WITHDRAWALS REQUEST ERROR: ", error);
  }
});

// fetch all withdrawals by admin
router.get("/request", [authMiddleware, authorized], async (req, res) => {
  try {
    const withdrawals = await WithdrawalModel.find()
      .select("createdAt amount status business code phone_number")
      ?.populate({ path: "business", select: "name" });

    return res.status(200).json(withdrawals);
  } catch (error) {
    console.log("MPESA WITHDRAWALS REQUEST ERROR: ", error);
    res?.status(400).json(error?.message);
  }
});
// fetch particular user withdrawals
//return: withdrawalID status totalAmount dateRequested
router.get("/request/:b_id", [authMiddleware, authorized], async (req, res) => {
  try {
    const withdrawals = await WithdrawalModel.find({
      business: req?.params?.b_id,
    }).select("createdAt amount status code ");

    return res.status(200).json({ withdrawals, count: withdrawals?.length });
  } catch (error) {
    console.log("MPESA WITHDRAWALS REQUEST ERROR: ", error);
    res?.status(400).json(error?.message);
  }
});
// update withdrawal
router.patch("/request/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    let id = req?.params?.id;

    if (!id) {
      res.status(400).json({ message: "withdrawal request id requiered!" });
    }
    let update = req?.body;
    const withdrawal = await WithdrawalModel.findByIdAndUpdate(id, update);

    if (req?.body?.status === "rejected") {
      withdrawal?.packages?.forEach(async (p) => {
        // redo mpesa log withdrawal status to false
        if (p?.del_type === "agent") {
          currentLog = await MpesaLogs.findOneAndUpdate(
            { package: p?._id, ResponseCode: 0 },
            { withdrawn: "false" }
          );
        } else if (p?.del_type === "doorstep") {
          currentLog = await MpesaLogs.findOneAndUpdate(
            { doorstep_package: p?._id, ResponseCode: 0 },
            { withdrawn: "false" }
          );
        } else if (p?.del_type === "rent" || p?.del_type === "") {
          currentLog = await MpesaLogs.findOneAndUpdate(
            { rent_package: p?._id, ResponseCode: 0 },
            { withdrawn: "false" }
          );
        }
      });
    }

    return res.status(200).json(withdrawal);
  } catch (error) {
    console.log("MPESA WITHDRAWAL UPDATE ERROR: ", error);
    res?.status(400).json(error?.message);
  }
});

module.exports = router;
