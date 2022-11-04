const express = require("express");
var Rent = require("models/rent_a_shelf_delivery.model");
var Rent_a_shelf_deliveries = require("models/rent_a_shelf_deliveries");
var Agent = require("models/agents.model");
var AgentDetails = require("models/agentAddmin.model");
var RiderRoutes = require("models/rider_routes.model");
var Collected = require("models/collectors.model");
var Unavailable = require("models/unavailable.model");
var Narations = require('models/agent_agent_narations.model');
var DoorstepNarations = require('models/door_step_narations.model');
var rentshelfNarations = require('models/rent_shelf_narations.model');
var Track_rent_a_shelf = require('models/rent_shelf_package_track.model');
var Track_door_step = require('models/door_step_package_track.model');

var Track_agent_packages = require('models/agent_package_track.model');
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
const { request } = require("express");
const router = express.Router();

router.post("/package", [authMiddleware, authorized], async (req, res) => {

  // let v = await Mpesa_stk("0790923387", 1, 1, "doorstep")
  // // console.log(v)
  // return res.status(200).json({ message: v })
  let newpackage
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

        newpackage = await new Door_step_Sent_package(packages[i]).save();
        let V = await new Track_door_step({ package: newpackage._id, created: moment(), state: "request", descriptions: `Package created`, reciept: newpackage.receipt_no }).save()
        console.log(V)
        await new DoorstepNarations({ package: newpackage._id, state: "request", descriptions: `Package created` }).save()
        await new DoorstepNarations({ package: newpackage._id, state: "assigned", descriptions: `Package assigned rider` }).save()


      }
      if (req.body.payment_option === "vendor") {
        await Mpesa_stk(req.body.payment_phone_number, req.body.total_payment_amount, req.user._id, "doorstep")
      }
      else {
        await Door_step_Sent_package.findOneAndUpdate({ _id: newpackage._id }, { payment_status: "to-be-paid" }, { new: true, useFindAndModify: false })

      }

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
        await new Track_rent_a_shelf({ package: savedPackage._id, created: moment(), state: "request", descriptions: `Package created`, reciept: savedPackage.receipt_no }).save()

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
      await new rentshelfNarations({ package: newPackage._id, state: "request", descriptions: `Package created` }).save()

      return res
        .status(200)
        .json({ message: "Package successfully Saved", newPackage });
    } else {
      const { packages } = req.body

      for (let i = 0; i < packages.length; i++) {
        let agent = await AgentDetails.findOne({ _id: packages[i].senderAgentID })
        let route = await RiderRoutes.findOne({ agent: agent._id })
        // 

        if (packages[i].product) {
          const product = await Product.findById(packages[i].product);
          packages[i].packageName = product.product_name;
          packages[i].isProduct = true;
          packages[i].package_value = product.price;
        }
        packages[i].createdBy = req.user._id
        packages[i].receipt_no = `${agent.prefix}${Makeid(5)}`;
        packages[i].assignedTo = route.rider
        let newpackage = await new Sent_package(packages[i]).save();
        await new Narations({ package: newpackage._id, state: "request", descriptions: `Package created` }).save()

        await new Track_agent_packages({ package: newpackage._id, created: moment(), state: "request", descriptions: `Package created`, reciept: newpackage.receipt_no }).save()
      }
      if (req.body.payment_option === "vendor" || req.body.payment_option === "collection") {

        await Mpesa_stk(req.body.payment_phone_number, req.body.total_payment_amount, req.user._id, "agent", packages)
      }

      // else {
      //   await Door_step_Sent_package.findOneAndUpdate({ _id: req.params.id }, { payment_status: "to-be-paid" }, { new: true, useFindAndModify: false })

      // }


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
router.get("/rent-shelf-package-narations/:id", [authMiddleware, authorized], async (req, res) => {
  try {

    let narations = await rentshelfNarations.findOne({ package: req.params.id }).sort({ createdAt: -1 })
    return res
      .status(200)
      .json(narations);

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
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

// change the package state as it is dropped to when its picked up
router.put("/rent-shelf/package/:id/:state", [authMiddleware, authorized], async (req, res) => {

  try {
    let package = await Rent_a_shelf_deliveries.findById(req.params.id).populate('businessId')

    await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state }, { new: true, useFindAndModify: false })
    if (req.params.state === "unavailable") {
      await new Unavailable({ package: req.params.id, reason: req.body.reason }).save()
    }
    if (req.params.state === "rejected") {
      await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state }, { new: true, useFindAndModify: false })
      await new Reject({ package: req.params.id, reject_reason: req.body.reason }).save()
    }
    if (req.params.state === "picked-from-seller") {
      await new rentshelfNarations({ package: req.params.id, state: req.params.state, descriptions: `Package dropped to agent name(receiver agent)` }).save()

      await Track_rent_a_shelf.findOneAndUpdate({ package: req.params.id }, { droppedTo: "63575250602a3e763b1305ed", droppedAt: Date.now() }, { new: true, useFindAndModify: false })

      const textbody = {

        address: Format_phone_number(`${package.customerPhoneNumber}`), Body: `Hello  ${package.customerName}, Collect parcel ${package.receipt_no} from ${package?.businessId?.name} at Philadelphia house Track now:  pickupmtaani.com
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

      let collector = await new Collected(req.body).save()
      await Track_rent_a_shelf.findOneAndUpdate({ package: req.params.id }, { collectedby: collector._id, collectedAt: Date.now() }, { new: true, useFindAndModify: false })

    }
    return res.status(200).json({ message: "Sucessfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
// get packages as per the state filter
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
// get package track
router.get("/rent-shelf/track/packages", [authMiddleware, authorized], async (req, res) => {
  try {
    let packages
    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      tra = await Track_rent_a_shelf.find({ $or: [{ reciept: searchKey }] }).sort({ createdAt: -1 }).limit(100)
        .populate('package')
        .populate("collectedby")
      // .populate("droppedTo")
      return res.status(200)
        .json(packages);
    } else {
      packages = await Track_rent_a_shelf.find().sort({ createdAt: -1 }).limit(100)
        .populate('package')
        .populate("collectedby")
        .populate({
          path: 'package',
          populate: {
            path: 'businessId',
          }
        })
      return res.status(200)
        .json(packages);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});


router.get("/rent-shelf-package-count", [authMiddleware, authorized], async (req, res) => {
  let agent = await AgentUser.findOne({ user: req.user._id })
  try {
    let agent_packages
    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      let dropped = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "dropped", $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
      let unavailable = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "unavailable", $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
      let picked = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "picked", $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
      let request = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "request", $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
      let collected = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "collected", $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
      let rejected = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "rejected", $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
      let droppedToagent = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "dropped-to-agent", $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
      let assigned = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "assigned", $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
      let pickedfromSender = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "picked-from-sender", $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
      return res.status(200)
        .json({ message: "Fetched Sucessfully after", pickedfromSender: pickedfromSender.length, cancelled: cancelled.length, droppedToagent: droppedToagent.length, assigned: assigned.length, dropped: dropped.length, assigneWarehouse: assigneWarehouse.length, warehouseTransit: warehouseTransit.length, unavailable: unavailable.length, picked: picked.length, request: request.length, delivered: delivered.length, collected: collected.length, rejected: rejected.length, onTransit: onTransit.length });
    } else {
      let dropped = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "dropped" })
      let unavailable = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "unavailable" })
      let picked = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "picked" })
      let request = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "request" })
      let collected = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "collected" })
      let rejected = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "rejected" })
      let onTransit = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "on-transit" })
      let cancelled = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "cancelled" })
      let droppedToagent = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "dropped-to-agent" })
      let assigned = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "assigned" })
      let pickedfromSender = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "picked-from-sender" })
      return res.status(200)
        .json({ message: "Fetched Sucessfully after", pickedfromSender: pickedfromSender.length, cancelled: cancelled.length, droppedToagent: droppedToagent.length, assigned: assigned.length, dropped: dropped.length, unavailable: unavailable.length, picked: picked.length, request: request.length, collected: collected.length, rejected: rejected.length, onTransit: onTransit.length });
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
    let agent_packages = {}
    let doorstep_packages = {}
    let shelves = {}
    // "request", "delivered", "collected", "cancelled", "rejected", "on-transit", "dropped-to-agent", 'collected', "assigned", "recieved-warehouse", "picked", "picked-from-sender", "unavailable", "dropped", "", "warehouse-transit"
    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      agent_packages.created = await Sent_package.find({ state: "request", createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);
      agent_packages.dropped = await Sent_package.find({ state: "picked-from-sender", createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);
      agent_packages.transit = await Sent_package.find({ $or: [{ state: "on-transit" }, { state: "warehouse-transit" }, { state: "assigned" }, { state: "dropped" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);
      agent_packages.warehouse = await Sent_package.find({ $or: [{ state: "recieved-warehouse" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);

      agent_packages.delivered = await Sent_package.find({ $or: [{ state: "dropped-to-agent" }, { state: "delivered" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);
      agent_packages.collected = await Sent_package.find({ $or: [{ state: "collected" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);

      doorstep_packages.created = await Door_step_Sent_package.find({ state: "request", createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);
      doorstep_packages.dropped = await Door_step_Sent_package.find({ state: "picked-from-sender", createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);
      doorstep_packages.transit = await Door_step_Sent_package.find({ $or: [{ state: "on-transit" }, { state: "warehouse-transit" }, { state: "assigned" }, { state: "dropped" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);
      doorstep_packages.warehouse = await Door_step_Sent_package.find({ $or: [{ state: "recieved-warehouse" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);

      doorstep_packages.delivered = await Door_step_Sent_package.find({ $or: [{ state: "dropped-to-agent" }, { state: "delivered" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);
      doorstep_packages.collected = await Door_step_Sent_package.find({ $or: [{ state: "collected" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);

      // doorstep_packages = await Door_step_Sent_package.find({
      //   createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }]
      // })
      //   .populate(
      //     "customerPhoneNumber packageName package_value package_value packageName customerName"
      //   )
      // .populate("agent")
      //   .sort({ createdAt: -1 })
      //   .limit(100);
      // shelves = await Rent_a_shelf_deliveries.find({ businessId: req.params.id, createdBy: req.user._id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] }).populate(
      // );
      shelves.created = await Rent_a_shelf_deliveries.find({ state: "request", createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .sort({ createdAt: -1 })
        .limit(100);
      shelves.dropped = await Rent_a_shelf_deliveries.find({ $or: [{ state: "picked-from-sender" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .sort({ createdAt: -1 })
        .limit(100);
      shelves.collected = await Rent_a_shelf_deliveries.find({ $or: [{ state: "collected" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .sort({ createdAt: -1 })
        .limit(100);
    } else {
      agent_packages.created = await Sent_package.find({ state: "request", createdBy: req.user._id, businessId: req.params.id })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);
      agent_packages.dropped = await Sent_package.find({ state: "picked-from-sender", createdBy: req.user._id, businessId: req.params.id })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);
      agent_packages.transit = await Sent_package.find({ $or: [{ state: "on-transit" }, { state: "warehouse-transit" }, { state: "assigned" }, { state: "dropped" }], createdBy: req.user._id, businessId: req.params.id })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);
      agent_packages.warehouse = await Sent_package.find({ $or: [{ state: "recieved-warehouse" }], createdBy: req.user._id, businessId: req.params.id })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);

      agent_packages.delivered = await Sent_package.find({ $or: [{ state: "dropped-to-agent" }, { state: "delivered" }], createdBy: req.user._id, businessId: req.params.id })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);
      agent_packages.collected = await Sent_package.find({ $or: [{ state: "collected" }], createdBy: req.user._id, businessId: req.params.id })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);

      doorstep_packages.created = await Door_step_Sent_package.find({ state: "request", createdBy: req.user._id, businessId: req.params.id })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);
      doorstep_packages.dropped = await Door_step_Sent_package.find({ state: "picked-from-sender", createdBy: req.user._id, businessId: req.params.id })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);
      doorstep_packages.transit = await Door_step_Sent_package.find({ $or: [{ state: "on-transit" }, { state: "warehouse-transit" }, { state: "assigned" }, { state: "dropped" }], createdBy: req.user._id, businessId: req.params.id })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);
      doorstep_packages.warehouse = await Door_step_Sent_package.find({ $or: [{ state: "recieved-warehouse" }], createdBy: req.user._id, businessId: req.params.id })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);

      doorstep_packages.delivered = await Door_step_Sent_package.find({ $or: [{ state: "dropped-to-agent" }, { state: "delivered" }], createdBy: req.user._id, businessId: req.params.id })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);
      doorstep_packages.collected = await Door_step_Sent_package.find({ $or: [{ state: "collected" }], createdBy: req.user._id, businessId: req.params.id })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);
      shelves.created = await Rent_a_shelf_deliveries.find({ state: "request", createdBy: req.user._id, businessId: req.params.id, })
        .sort({ createdAt: -1 })
        .limit(100);
      shelves.dropped = await Rent_a_shelf_deliveries.find({ $or: [{ state: "picked-from-sender" }], createdBy: req.user._id, businessId: req.params.id, })
        .sort({ createdAt: -1 })
        .limit(100);
      shelves.collected = await Rent_a_shelf_deliveries.find({ $or: [{ state: "collected" }], createdBy: req.user._id, businessId: req.params.id, })
        .sort({ createdAt: -1 })
        .limit(100);
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
    const sender = await AgentDetails.findOne({ $or: [{ _id: package?.senderAgentID }, { _id: package?.receieverAgentID }] })
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
