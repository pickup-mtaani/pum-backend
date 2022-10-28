const express = require("express");
var Rent = require("models/rent_a_shelf_delivery.model");
var Rent_a_shelf_deliveries = require("models/rent_a_shelf_deliveries");
var Agent = require("models/agents.model");
var AgentDetails = require("models/agentAddmin.model");
var RiderRoutes = require("models/rider_routes.model");
var Collected = require("models/collectors.model");
var Unavailable = require("models/unavailable.model");
var UnavailableDoorStep = require("models/unavailable_doorstep.model");
var Declined = require("models/declined.model");
var Bussiness = require("models/business.model");
var BussinessDetails = require("models/business_details.model");
const mpesaLogs = require('models/mpesa_logs.model')
var Conversation = require('models/conversation.model')
const Message = require("models/messages.model");
var Product = require("models/products.model.js");
var User = require("models/user.model.js")
var Rider_Package = require('models/rider_package.model')
var Sent_package = require("models/package.modal.js");
var Door_step_Sent_package = require("models/doorStep_delivery_packages.model");
var Reject = require("models/Rejected_parcels.model");
var Reciever = require("models/reciever.model");
var AgentUser = require('models/agent_user.model');
var {
  authMiddleware,
  authorized,
} = require("middlewere/authorization.middlewere");
const { Makeid } = require("../helpers/randomNo.helper");
const { SendMessage } = require("../helpers/sms.helper");
const moment = require("moment");
const Mpesa_stk = require("../helpers/stk_push.helper");

const { findOne } = require("../models/rider_routes.model");
const Format_phone_number = require("../helpers/phone_number_formater");
const router = express.Router();

router.post("/package", [authMiddleware, authorized], async (req, res) => {

  // let v = await Mpesa_stk("0707717455", 1, 1, "doorstep")
  // // console.log(v)
  // return res.status(200).json({ message: v })
  try {
    const body = req.body;
    body.createdBy = req.user._id;
    if (body.delivery_type === "door_step") {

      const { packages } = req.body;
      for (let i = 0; i < packages.length; i++) {

        let agent_id = await AgentDetails.findOne({ _id: packages[i].agent })
        let route = await RiderRoutes.findOne({ agent: agent_id._id })

        const currentBusiness = await Bussiness.findById(packages[i].businessId).populate(
          {
            path: "details",
            populate: {
              path: "agent"
            }
          })

        if (packages[i].product) {
          const product = await Product.findById(packages[i].product);
          packages[i].packageName = product.product_name;
          packages[i].isProduct = true;

          packages[i].package_value = product.price
        }
        packages[i].createdBy = req.user._id
        packages[i].origin = { lng: null, lat: null, name: '' }

        packages[i].destination = {
          name: body?.packages[i]?.destination?.name,
          lat: body?.packages[i]?.destination?.latitude,
          lng: body?.packages[i]?.destination?.longitude
        }
        packages[i].receipt_no = `pm-${Makeid(5)}`;
        packages[i].assignedTo = route.rider

        await new Door_step_Sent_package(packages[i]).save();

      }

      await Mpesa_stk(req.body.payment_phone_number, req.body.total_payment_amount, req.user._id, "doorstep")

      return res
        .status(200)
        .json({ message: "Package successfully Saved", });
    } else if (body.delivery_type === "shelf") {

      let packagesArr = [];
      const { packages, ...rest } = req.body;
      for (let i = 0; i < packages.length; i++) {
        let agent_id = await AgentDetails.findOne({ _id: packages[i].agent })
        if (packages[i].product) {
          const product = await Product.findById(packages[i].product);
          packages[i].packageName = product.product_name;
          packages[i].isProduct = true;
          packages[i].package_value = product.price;
        }
        packages[i].location = "63575250602a3e763b1305ed";
        packages[i].createdBy = req.user._id;
        packages[i].businessId = req.body.businessId;
        packages[i].receipt_no = `pm-${Makeid(5)}`;
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
      const { packages } = req.body

      for (let i = 0; i < packages.length; i++) {
        let agent = await AgentDetails.findOne({ _id: packages[i].senderAgentID })
        let route = await RiderRoutes.findOne({ agent: agent._id })
        await Mpesa_stk(req.body.payment_phone_number, req.body.total_payment_amount, req.user._id, "agent", packages)

        if (packages[i].product) {
          const product = await Product.findById(packages[i].product);
          packages[i].packageName = product.product_name;
          packages[i].isProduct = true;
          packages[i].package_value = product.price;
        }
        packages[i].createdBy = req.user._id
        packages[i].receipt_no = `${agent.prefix}${Makeid(5)}`;
        packages[i].assignedTo = route.rider
        await new Sent_package(packages[i]).save();

      }

      return res
        .status(200)
        .json({ message: "Package successfully Saved" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: " failed  to send package", error });
  }
});

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
      price = 1;
    } else if (
      (sender?.zone.name === "Zone C" && receiver?.zone.name === "Zone B") ||
      (sender?.zone.name === "Zone B" && receiver?.zone.name === "Zone C")
    ) {
      price = 2;
    } else if (
      (sender?.zone.name === "Zone C" && receiver?.zone.name === "Zone A") ||
      (sender?.zone.name === "Zone A" && receiver?.zone.name === "Zone C")
    ) {
      price = 2;
    } else if (
      sender?.zone.name === "Zone A" &&
      receiver?.zone.name === "Zone A"
    ) {
      price = 1;
    } else if (
      sender?.zone.name === "Zone B" &&
      receiver?.zone.name === "Zone A"
    ) {
      price = 1;
    } else if (
      sender?.zone.name === "Zone C" &&
      receiver?.zone.name === "Zone C"
    ) {
      price = 2;
    }
    return res.status(200).json({ message: "price set successfully ", price });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.put("/rent-shelf/package/:id/:state", [authMiddleware, authorized], async (req, res) => {

  try {
    let package = await Rent_a_shelf_deliveries.findById(req.params.id)

    await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state }, { new: true, useFindAndModify: false })
    if (req.params.state === "unavailable") {
      await new Unavailable({ package: req.params.id, reason: req.body.reason }).save()
    }
    if (req.params.state === "rejected") {
      await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state }, { new: true, useFindAndModify: false })
      await new Reject({ package: req.params.id, reject_reason: req.body.reason }).save()
    }
    if (req.params.state === "picked-from-seller") {
      const textbody = {
        address: Format_phone_number(`${package.customerPhoneNumber}`), Body: `
      Hello  ${package.customerName}, Collect parcel ${package.receipt_no} from Philadelphia house Track now:  pickupmtaani.com
      ` }
      await SendMessage(textbody)

    }
    if (req.params.state === "assigned" || req.params.state === "assigned-warehouse") {
      await new Rider_Package({ package: req.params.id, rider: req.query.rider }).save()
      await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state, assignedTo: req.query.rider }, { new: true, useFindAndModify: false })
    }
    if (req.params.state === "collected") {
      req.body.package = req.params.id
      req.body.dispatchedBy = req.user._id


      await new Collected(req.body).save()
    }
    return res.status(200).json({ message: "Sucessfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/rent-shelf/:state", [authMiddleware, authorized], async (req, res) => {
  let agent = await AgentUser.findOne({ user: req.user._id })
  try {
    let agent_packages
    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      agent_packages = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: req.params.state, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] }).sort({ createdAt: -1 }).limit(100)
        .populate('location')
        .populate('businessId')
        .populate('createdBy')
      return res.status(200)
        .json(agent_packages);
    } else {
      agent_packages = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: req.params.state }).sort({ createdAt: -1 }).limit(100)
        .populate('location')
        .populate('businessId')
        .populate('createdBy')
      return res.status(200)
        .json(agent_packages);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/packages", async (req, res) => {
  try {
    let limit

    if (req.query.limit) {
      limit = req.query.limit
    }

    else {
      limit = 100
    }
    let agent_packages
    let doorstep_packages
    if (req.query.state === "all") {
      agent_packages = await Sent_package.find().sort({ createdAt: -1 })
        .limit(limit).populate(
          "assignedTo", "name phone_number"
        );
      doorstep_packages = await Door_step_Sent_package.find({
        // businessId: req.params.id
      })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        ).populate("assignedTo", "name phone_number").populate("businessId", "name")
        .sort({ createdAt: -1 })
        .limit(limit);
    } else {
      agent_packages = await Sent_package.find({ state: req.query.state }).sort({ createdAt: -1 })
        .limit(limit).populate(

          "assignedTo", "name phone_number"
        );
      doorstep_packages = await Door_step_Sent_package.find({
        state: req.query.state
      })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        ).populate("assignedTo", "name phone_number").populate("businessId", "name")
        .sort({ createdAt: -1 })
        .limit(limit);
    }


    const shelves = await Rent.find({}).populate(
      "packages",
      "customerPhoneNumber  package_value packageName customerName _id"
    ).populate("businessId", "name");
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
    let agent_packages
    let doorstep_packages
    let shelves
    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      agent_packages = await Sent_package.find({ createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })

        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        .limit(100);

      doorstep_packages = await Door_step_Sent_package.find({
        createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }]
      })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        .sort({ createdAt: -1 })
        .limit(100);
      shelves = await Rent_a_shelf_deliveries.find({ businessId: req.params.id, createdBy: req.user._id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] }).populate(


      );
    } else {
      agent_packages = await Sent_package.find({ createdBy: req.user._id, businessId: req.params.id, })

        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        .limit(100);

      doorstep_packages = await Door_step_Sent_package.find({
        createdBy: req.user._id, businessId: req.params.id
      })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        .sort({ createdAt: -1 })
        .limit(100);
      shelves = await Rent_a_shelf_deliveries.find({ businessId: req.params.id, createdBy: req.user._id }).populate(

      );
    }
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
router.get("/package/:id", async (req, res) => {
  try {
    const package = await Sent_package.findById(req.params.id)
    // console.log(package);
    const sender = await AgentDetails.findOne({ $or: [{ user: package?.senderAgentID }, { user: package?.receieverAgentID }] })
    // const reciever

    return res
      .status(200)
      .json({

        package, sender: sender.business_name,

      });
  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

router.get("/collectors/", async (req, res) => {
  try {

    const users = await Collected.find().populate('package').populate('dispatchedBy')
    return res
      .status(200)
      .json(users);
  } catch (error) {
    console.log(error)
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
