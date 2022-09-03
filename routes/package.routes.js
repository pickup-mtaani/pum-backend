const express = require("express");
var AgentPackage = require("models/agent_agent_delivery.modal.js");
var Doorstep_pack = require("models/doorStep_delivery.model");
var Rent = require("models/rent_a_shelf_delivery.model");
var Rent_a_shelf_deliveries = require("models/rent_a_shelf_deliveries");
var Agent = require("models/agents.model");
var Product = require("models/products.model.js");
var User = require("models/user.model.js");
var Sent_package = require("models/package.modal.js");
var Door_step_Sent_package = require("models/doorStep_delivery_packages.model");
var Business = require("models/business.model.js");
var Reject = require("models/Rejected_parcels.model");
var Reciever = require("models/reciever.model");
var {
  authMiddleware,
  authorized,
} = require("middlewere/authorization.middlewere");
const { Makeid } = require("../helpers/randomNo.helper");
const { SendMessage } = require("../helpers/sms.helper");
const moment = require("moment");
const Mpesa_stk = require("../helpers/stk_push.helper");
const router = express.Router();

router.post("/package", [authMiddleware, authorized], async (req, res) => {
  try {
    console.log(req.body)
    const body = req.body;
    body.receipt_no = `PM-${Makeid(5)}`;
    body.createdBy = req.user._id;
    if (body.delivery_type === "door_step") {
      let packagesArr = [];
      const { packages, ...rest } = req.body;
      for (let i = 0; i < packages.length; i++) {
        if (packages[i].product) {
          const product = await Product.findById(packages[i].product);
          packages[i].packageName = product.product_name;
          packages[i].isProduct = true;
          packages[i].package_value = product.price;
        }
        const savedPackage = await new Door_step_Sent_package(
          packages[i]
        ).save();
        packagesArr.push(savedPackage._id);
      }
      const newPackage = await new Doorstep_pack({
        rest,
        packages: packagesArr,
        payment_phone_number: req.body.payment_phone_number,
        businessId: req.body.businessId,
        total_payment_amount: req.body.total_payment_amount,
        delivery_type: req.body.delivery_type,
        receipt_no: req.body.receipt_no,
        createdBy: req.user._id,
      }).save();
      Mpesa_stk(req.body.payment_phone_number, req.body.total_payment_amount, req.user._id, newPackage._id, "doorstep")
      return res
        .status(200)
        .json({ message: "Package successfully Saved", newPackage });
    } else if (body.delivery_type === "shelf") {
      let packagesArr = [];
      const { packages, ...rest } = req.body;
      for (let i = 0; i < packages.length; i++) {
        if (packages[i].product) {
          const product = await Product.findById(packages[i].product);
          packages[i].packageName = product.product_name;
          packages[i].isProduct = true;
          packages[i].package_value = product.price;
        }
        packages[i].location = "6304d87a5be36ab5bfb66e2e";
       
        const savedPackage = await new Rent_a_shelf_deliveries(
          packages[i]
        ).save();
        packagesArr.push(savedPackage._id);
      }
      const newPackage = await new Rent({
        rest,
        packages: packagesArr,
        customerName: req.body.customerName,
        customerPhoneNumber: req.body.customerPhoneNumber,
        businessId: req.body.businessId,
        total_payment_amount: req.body.total_payment_amount,
        payment_phone_number: req.body.payment_phone_number,
        receipt_no: req.body.receipt_no,
        createdBy: req.user._id,
      }).save();
      return res
        .status(200)
        .json({ message: "Package successfully Saved", newPackage });
    } else {
      console.log(req.body)
      let packagesArr = [];
      const { packages, ...rest } = req.body;
      for (let i = 0; i < packages.length; i++) {
        if (packages[i].product) {
          const product = await Product.findById(packages[i].product);
          packages[i].packageName = product.product_name;
          packages[i].isProduct = true;
          packages[i].package_value = product.price;
        }

        const newPackage = new Sent_package(packages[i]);
        const savedPackage = await newPackage.save();
        packagesArr.push(savedPackage._id);
      }
      const newPackage = new AgentPackage({
        rest,
        packages: packagesArr,
        receipt_no: req.body.receipt_no,
        createdBy: req.user._id,
        payment_phone_number: req.body.payment_phone_number,
        businessId: req.body.businessId,
        total_payment_amount:req.body.total_payment_amount

      });
      // req.body.packages = packagesArr
      await newPackage.save();
      Mpesa_stk(req.body.payment_phone_number, req.body.total_payment_amount, req.user._id, newPackage._id, "agent")
      return res
        .status(200)
        .json({ message: "Package successfully Saved", newPackage });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: " failed  to send package", error });
  }
});

router.post(
  "/package/:id/recieve",
  [authMiddleware, authorized],
  async (req, res) => {
    try {
      const Pack = await Package.findById(req.params.id).populate([
        "thrifter_id",
        "current_custodian",
      ]);
      const RecievedPack = await Package.findOneAndUpdate(
        { _id: req.params.id },
        {
          recieved: true,
          receiving_agent: req.user._id,
          recieved_at: Date.now(),
        },
        { new: true, useFindAndModify: false }
      );
      const smsBody = {
        address: `${Pack.recipient_phone}`,
        Body: `Hello ${Pack.recipient_name}, Kindly Collect your Parcel from ${Pack.thrifter_id.name
          } at ${Pack.current_custodian.agent_location
          } before the close of Day ${moment(
            new Date().setDate(new Date().getDate() + 3)
          ).format("ddd MMM YY")}`,
      };
      // const body = req.body

      // body.package = req.params.id
      // await new Reciever(body).save()
      await SendMessage(smsBody);
      return res
        .status(200)
        .json({ message: "Package successfully Recieved", RecievedPack });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "operation failed ", error });
    }
  }
);
router.post("/package/delivery-charge", async (req, res) => {
  try {
    let price = 100;
    const { senderAgentID, receieverAgentID } = req.body;

    console.log(senderAgentID, receieverAgentID);
    const sender = await Agent.findOne({ _id: senderAgentID }).populate("zone");
    const receiver = await Agent.findOne({ _id: receieverAgentID }).populate(
      "zone"
    );
    if (
      (sender?.zone.name === "Zone A" && receiver?.zone.name === "Zone B") ||
      (sender?.zone.name === "Zone B" && receiver?.zone.name === "Zone A")
    ) {
      price = 100;
    } else if (
      (sender?.zone.name === "Zone C" && receiver?.zone.name === "Zone B") ||
      (sender?.zone.name === "Zone B" && receiver?.zone.name === "Zone C")
    ) {
      price = 200;
    } else if (
      (sender?.zone.name === "Zone C" && receiver?.zone.name === "Zone A") ||
      (sender?.zone.name === "Zone A" && receiver?.zone.name === "Zone C")
    ) {
      price = 200;
    } else if (
      sender?.zone.name === "Zone A" &&
      receiver?.zone.name === "Zone A"
    ) {
      price = 100;
    } else if (
      sender?.zone.name === "Zone B" &&
      receiver?.zone.name === "Zone A"
    ) {
      price = 180;
    } else if (
      sender?.zone.name === "Zone C" &&
      receiver?.zone.name === "Zone C"
    ) {
      price = 250;
    }
    console.log(price);
    return res.status(200).json({ message: "price set successfully ", price });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

router.post(
  "/package/:id/collect",
  [authMiddleware, authorized],
  async (req, res) => {
    try {
      const Pack = await Package.findById(req.params.id).populate([
        "thrifter_id",
        "current_custodian",
      ]);
      const RecievedPack = await Package.findOneAndUpdate(
        { _id: req.params.id },
        {
          collected: true,
          receiving_agent: req.user._id,
          collected_at: Date.now(),
        },
        { new: true, useFindAndModify: false }
      );

      const body = req.body;
      body.package = req.params.id;
      await new Reciever(body).save();
      const smsBody = {
        address: `{Pack.recipient_phone}`,
        Body: `Hello ${Pack.recipient_name}, Your Parcel from ${Pack.thrifter_id.name} has been collected  by ${body.reciver_name}of ID_NO ${body.reciver_id_no}`,
      };

      await SendMessage(smsBody);
      return res
        .status(200)
        .json({ message: "Package successfully Recieved", RecievedPack });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "operation failed ", error });
    }
  }
);

router.post(
  "/package/:id/reject",
  [authMiddleware, authorized],
  async (req, res) => {
    try {
      const Pack = await Package.findById(req.params.id).populate(
        "thrifter_id"
      );
      const Thrifter = await User.findById(Pack.thrifter_id.user_id);

      const newReject = new Reject(req.body).save();
      const smsBody = {
        address: `${Thrifter.phone_number}`,
        Body: `Hello ${Pack.thrifter_id.name},Parcel from ${Pack.receipt_no} has been rejected due ${req.body.reject_reason} kindly edit the details to allow further processing`,
      };
      await SendMessage(smsBody);
      const RecievedPack = await Package.findOneAndUpdate(
        { _id: req.params.id },
        {
          rejected: true,
          rejecting_agent: req.user._id,
          rejected_at: Date.now(),
          rejected_reasons: newReject._id,
        },
        { new: true, useFindAndModify: false }
      );
      return res
        .status(200)
        .json({ message: "Package successfully rejectesd", RecievedPack });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "operation failed ", error });
    }
  }
);
// router.post('/package/:id/reject', [authMiddleware, authorized], async (req, res) => {
//     try {

//         const Pack = Package.findById(req.params.id)
//         const newReject = new Reject(req.body).save()
//         const RecievedPack = await Package.findOneAndUpdate({ _id: req.params.id }, { rejected: true, rejecting_agent: req.user._id, rejected_at: Date.now(), rejected_reasons: newReject._id }, { new: true, useFindAndModify: false })
//         return res.status(200).json({ message: 'Package Rejected  and thriter notified', RecievedPack });

//     } catch (error) {
//
//         return res.status(400).json({ success: false, message: 'operation failed ', error });
//     }

// });

router.get("/packages", async (req, res) => {
  try {
    const agent_packages = await AgentPackage.find()
      .populate({
        path: "packages",
        populate: [
          {
            path: "receieverAgentID",
            select: "loc",
          },
          {
            path: "senderAgentID",
            select: "loc",
          },
        ],
      }).populate('businessId')
      .sort({ createdAt: -1 })
      .limit(10);
    const doorstep_packages = await Doorstep_pack.find({ })
      .populate(
        "packages",
        "customerPhoneNumber packageName package_value package_value packageName payment_amount customerName"
      ).populate('businessId')
      .sort({ createdAt: -1 })
      .limit(10);
    const shelves = await Rent.find().populate(
      "packages",
      "customerPhoneNumber  package_value packageName customerName _id"
    ).populate('businessId').sort({ createdAt: -1 })
    .limit(10);;
    return res
      .status(200)
      .json({
        message: "Fetched Sucessfully",
        agent_packages,
        doorstep_packages,
        shelves,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

router.get("/user-packages/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    const agent_packages = await AgentPackage.find({ createdBy: req.user._id ,businessId:req.params.id})
      .populate({
        path: "packages",
        populate: [
          {
            path: "receieverAgentID",
            select: "lat lng",
          },
          {
            path: "senderAgentID",
            select: "lat lng",
          },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(100);

    const doorstep_packages = await Doorstep_pack.find({
      createdBy: req.user._id,businessId:req.params.id
    })
      .populate(
        "packages",
        "customerPhoneNumber packageName package_value package_value packageName payment_amount customerName"
      )
      .sort({ createdAt: -1 })
      .limit(100);
    const shelves = await Rent.find({businessId:req.params.id,createdBy:req.user._id}).populate(
      "packages",
      "customerPhoneNumber  package_value packageName customerName _id"
    );
    return res
      .status(200)
      .json({
        message: "Fetched Sucessfully",
        agent_packages,
        doorstep_packages,
        shelves,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operationhj failed ", error });
  }
});

router.get("/packages/:id", async (req, res) => {
  try {
    const packages = await Package.find({ businessId: req.params.id })
      .populate(["createdBy", "senderAgentID", "receieverAgentID"])
      .sort({ createdAt: -1 });
    const rented_deliveries = await Rent.find({ businessId: req.params.id })
      .populate([
        "createdBy",
        "businessId",
        "from_agent_shelf",
        "to_agent_shelf",
        "rider",
      ])
      .sort({ createdAt: -1 })
      .limit(10);
    const door_step_deliveries = await Doorstep.find({
      businessId: req.params.id,
    })
      .populate(["createdBy", "businessId"])
      .sort({ createdAt: -1 })
      .limit(10);
    // await User.findOneAndUpdate({ _id: req.user._id }, { role: RoleOb._id }, { new: true, useFindAndModify: false })
    return res
      .status(200)
      .json({
        message: "Fetched Sucessfully",
        packages,
        door_step_deliveries,
        rented_deliveries,
      });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/packages/bussiness/:id", async (req, res) => {
  try {
    const packages = await Package.find({ businessId: req.params.id })
      .populate(["createdBy", "senderAgentID", "receieverAgentID"])
      .sort({ createdAt: -1 });

    // await User.findOneAndUpdate({ _id: req.user._id }, { role: RoleOb._id }, { new: true, useFindAndModify: false })
    return res.status(200).json({ message: "Fetched Sucessfully", packages });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

module.exports = router;
