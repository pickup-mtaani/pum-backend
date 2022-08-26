const express = require("express");
var AgentPackage = require("models/agent_agent_delivery.modal.js");
var Doorstep = require("models/doorStep_delivery.model");
var Rent = require("models/rent_a_shelf_delivery.model");
var Agent = require("models/agents.model");
var Product = require("models/products.model.js");
var User = require("models/user.model.js");
var Sent_package = require("models/package.modal.js");
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
const router = express.Router();

router.post("/package", [authMiddleware, authorized], async (req, res) => {
  try {
    const body = req.body;
    // console.log(req.body)
    if (body.product) {
      const product = await Product.findById(body.product);
      body.packageName = product.product_name;
      body.isProduct = true;
      body.package_value = product.price;
    }
    body.receipt_no = `PM-${Makeid(5)}`;
    body.createdBy = req.user._id;
    if (body.delivery_type === "door_step") {
      const newPackage = new Doorstep(req.body);
      await newPackage.save();
      return res.status(200).json({ message: "Package successfully Saved", newPackage });
    } else if (body.delivery_type === "rent_a_shelf") {
      const newPackage = new Rent(req.body);
      await newPackage.save();
      return res.status(200).json({ message: "Package successfully Saved", newPackage });
    } else {
      let packagesArr = []
      const { packages, ...rest } = req.body
      for (let i = 0; i < packages.length; i++) {

        body.customerName = packages[i].customerName
        body.customerPhoneNumber = packages[i].customerPhoneNumber
        body.packageName = packages[i].packageName
        body.description = packages[i].description
        body.package_value = packages[i].package_value
        // body.isProduct=packages[i].
        body.total_fee = packages[i].total_fee
        body.delivery_fee = packages[i].delivery_fee
        body.receieverAgentID = packages[i].receieverAgentID
        body.senderAgentID = packages[i].senderAgentID
        const newPackage = new Sent_package(packages[i]);
        const savedPackage = await newPackage.save();
        packagesArr.push(savedPackage._id)
      }
      console.log(packagesArr)
      const newPackage = new AgentPackage({ rest, packages: packagesArr });
      // req.body.packages = packagesArr
      await newPackage.save();
      return res.status(200).json({ message: "Package successfully Saved", newPackage });
    }


  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
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
router.post(
  "/package/delivery-charge",
  async (req, res) => {
    try {
      let price = 0
      const { senderAgentID, receieverAgentID } = req.body
      const sender = await Agent.findOne({ _id: senderAgentID }).populate('zone')
      const receiver = await Agent.findOne({ _id: receieverAgentID }).populate('zone')
      if (sender?.zone.name === "Zone A" && receiver?.zone.name === "Zone B" || sender?.zone.name === "Zone B" && receiver?.zone.name === "Zone A") {
        price = 180
      } else if (sender?.zone.name === "Zone C" && receiver?.zone.name === "Zone B" || sender?.zone.name === "Zone B" && receiver?.zone.name === "Zone C") {
        price = 380

      } else if (sender?.zone.name === "Zone C" && receiver?.zone.name === "Zone A" || sender?.zone.name === "Zone A" && receiver?.zone.name === "Zone C") {
        price = 280
      }
      else {
        price = 10
      }
      return res
        .status(200)
        .json({ message: "price set successfully ", price });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "operation failed ", error });
    }
  }
);

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
    const door_step_deliveries = await Doorstep.find()
      .populate([
        "createdBy",
        "businessId", "rider"
      ])
      .sort({ createdAt: -1 }).limit(10);
    const rented_deliveries = await Rent.find()
      .populate([
        "createdBy",
        "businessId", "from_agent_shelf", "to_agent_shelf", "rider"
      ])
      .sort({ createdAt: -1 }).limit(10);
    const packages = await AgentPackage.find()
      .populate([
        "createdBy",
        "packages",
        "businessId",
      ])
      .sort({ createdAt: -1 }).limit(100);

    return res.status(200).json({ message: "Fetched Sucessfully", packages, door_step_deliveries, rented_deliveries });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/user-packages", [authMiddleware, authorized], async (req, res) => {
  try {

    const packages = await AgentPackage.find({ createdBy: req.user._id })
      .populate([
        "packages",
        "businessId",
      ])
      .sort({ createdAt: -1 }).limit(100);

    return res.status(200).json({ message: "Fetched Sucessfully", packages, });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});


router.get("/packages/:id", async (req, res) => {
  try {

    const packages = await Package.find({ businessId: req.params.id })
      .populate([
        "createdBy",
        "senderAgentID",
        "receieverAgentID",

      ])
      .sort({ createdAt: -1 });
    const rented_deliveries = await Rent.find({ businessId: req.params.id })
      .populate([
        "createdBy",
        "businessId", "from_agent_shelf", "to_agent_shelf", "rider"
      ])
      .sort({ createdAt: -1 }).limit(10);
    const door_step_deliveries = await Doorstep.find({ businessId: req.params.id })
      .populate([
        "createdBy",
        "businessId",
      ])
      .sort({ createdAt: -1 }).limit(10);
    // await User.findOneAndUpdate({ _id: req.user._id }, { role: RoleOb._id }, { new: true, useFindAndModify: false })
    return res.status(200).json({ message: "Fetched Sucessfully", packages, door_step_deliveries, rented_deliveries });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/packages/bussiness/:id", async (req, res) => {
  try {
    const packages = await Package.find({ businessId: req.params.id })
      .populate([
        "createdBy",
        "senderAgentID",
        "receieverAgentID",

      ])
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
