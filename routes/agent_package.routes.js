const express = require("express");
var Collected = require("models/collectors.model");
var Unavailable = require("models/unavailable.model");
var Rider_Package = require('models/rider_package.model')
var Narations = require('models/agent_agent_narations.model');
var Agent = require('models/agentAddmin.model')
var Sent_package = require("models/package.modal.js");
var Rider = require("models/rider.model");
var AgentUser = require('models/agent_user.model');
var Reject = require("models/Rejected_parcels.model");
var Track_agent_packages = require('models/agent_package_track.model');
var mongoose = require('mongoose')
var {
  authMiddleware,
  authorized,
} = require("middlewere/authorization.middlewere");
const { Makeid } = require("../helpers/randomNo.helper");
const { SendMessage } = require("../helpers/sms.helper");
const moment = require("moment");
var Commision = require("models/commission.model");
const Format_phone_number = require("../helpers/phone_number_formater");
const { populate } = require("../models/mpesa_logs.model");
const router = express.Router();
function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

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
router.put("/agent/package/:id/:state", [authMiddleware, authorized], async (req, res) => {

  try {
    const { type, } = req.query
    let package = await Sent_package.findById(req.params.id).populate('senderAgentID')
    let rider = await Rider.findOne({ user: package.assignedTo })
    await Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state }, { new: true, useFindAndModify: false })
    if (req.params.state === "unavailable") {
      await new Unavailable({ package: req.params.id, reason: req.body.reason }).save()
    }
    if (req.params.state === "picked-from-sender") {
      try {
        await new Narations({ package: req.params.id, state: req.params.state, descriptions: `Package dropped to agent(${package.senderAgentID.business_name})` }).save()
        await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, { droppedTo: package?.senderAgentID?._id, droppedAt: Date.now() }, { new: true, useFindAndModify: false })
        const textbody = { address: Format_phone_number(`${package.customerPhoneNumber}`), Body: `Hi ${package.customerName}\nYour Package with reciept No ${package.receipt_no} has been  dropped at ${package?.senderAgentID?.business_name} and will be shipped to in 24hrs ` }
        await SendMessage(textbody)
        await new Narations({ package: req.params.id, state: req.params.state, descriptions: `Package dropped to agent(${package.senderAgentID.business_name})` }).save()
        let payments = getRandomNumberBetween(100, 200)
        await new Commision({ agent: req.user._id, agent_package: req.params.id, commision: 0.1 * parseInt(payments) }).save()
      } catch (error) {
        console.log(error)
      }
    }
    if (req.params.state === "delivered") {
      const textbody = { address: Format_phone_number(`${package.customerPhoneNumber}`), Body: `Hi ${package.customerName}\nYour Package with reciept No ${package.receipt_no} has been  delivered at ${package?.senderAgentID?.business_name} and will be shipped to in 2hrs ` }
      await SendMessage(textbody)

    }
    if (req.params.state === "rejected") {
      let rejected = await new Reject({ package: req.params.id, reject_reason: req.body.reason }).save()
      await Sent_package.findOneAndUpdate({ _id: req.params.id }, { reject_Id: rejected._id }, { new: true, useFindAndModify: false })

    }
    if (req.params.state === "assigned") {
      await new Rider_Package({ package: req.params.id, rider: package.assignedTo }).save()
      let assignrNarations = await new Narations({ package: req.params.id, state: req.params.state, descriptions: `Package assigned rider` }).save()
      await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, { assignedTo: package.assignedTo, assignedAt: Date.now() }, { new: true, useFindAndModify: false })

      await Rider.findOneAndUpdate({ user: package.assignedTo }, { no_of_packages: parseInt(rider.no_of_packages + 1) }, { new: true, useFindAndModify: false })
    }
    if (req.params.state === "dropped-to-agent") {
      await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, { droppedToagentAt: Date.now() }, { new: true, useFindAndModify: false })

      await new Narations({ package: req.params.id, state: req.params.state, descriptions: `package delivered to agent name(${package.receieverAgentID.business_name})` }).save()
    }
    if (req.params.state === "assigned-warehouse") {
      await new Narations({ package: req.params.id, state: req.params.state, descriptions: `Package package assigned rider` }).save()
      await new Rider_Package({ package: req.params.id, rider: req.query.rider }).save()
      await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, { reassignedTo: req.params.rider, reassignedAt: Date.now() }, { new: true, useFindAndModify: false })

      await Sent_package.findOneAndUpdate({ _id: req.params.id }, { assignedTo: req.query.rider }, { new: true, useFindAndModify: false })
      // await Rider.findOneAndUpdate({ user: package.assignedTo }, { no_of_packages: parseInt(rider.no_of_packages + 1) }, { new: true, useFindAndModify: false })
    }
    if (req.params.state === "dropped") {
      await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, { warehouseAt: Date.now() }, { new: true, useFindAndModify: false })

      await new Narations({ package: req.params.id, state: req.params.state, descriptions: `Package dropped to warehouse` }).save()
    }
    if (req.params.state === "dropped" || req.params.state === "delivered" || req.params.state === "dropped-to-agent") {
      await Rider.findOneAndUpdate({ user: package.assignedTo }, { no_of_packages: parseInt(rider.no_of_packages - 1) }, { new: true, useFindAndModify: false })
    }
    if (req.params.state === "collected") {
      try {
        req.body.package = req.params.id
        req.body.dispatchedBy = req.user._id
        let saved = await new Collected(req.body).save()
        await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, { saved: collector._id, collectedAt: Date.now() }, { new: true, useFindAndModify: false })
        await new Narations({ package: req.params.id, state: req.params.state, descriptions: `Package collected by customer.` }).save()
      } catch (error) {
        console.log(error)
      }
    }
    return res.status(200).json({ message: "Sucessfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/agents-packages/:state", [authMiddleware, authorized], async (req, res) => {

  try {
    let agent = await AgentUser.findOne({ user: req.user._id })
    var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
    let agent_packages

    if (req.query.searchKey) {
      agent_packages = await Sent_package.find({ payment_status: "paid", state: req.params.state, assignedTo: req.user._id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] }).sort({ createdAt: -1 }).limit(100)
        .populate('createdBy', 'f_name l_name name')
        .populate('receieverAgentID', 'business_name')
        .populate('senderAgentID', 'business_name')
        .populate('businessId')


      return res
        .status(200)
        .json(agent_packages);
    } else {
      agent_packages = await Sent_package.find({ payment_status: "paid", state: req.params.state, assignedTo: req.user._id }).sort({ createdAt: -1 }).limit(100)
        .populate('createdBy', 'f_name l_name name')
        .populate('receieverAgentID', 'business_name')
        .populate('senderAgentID', 'business_name')
        .populate('businessId')

      return res
        .status(200)
        .json(agent_packages);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/agent-package-narations/:id", [authMiddleware, authorized], async (req, res) => {
  try {

    let narations = await Narations.find({ package: req.params.id }).sort({ createdAt: -1 })
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

router.get("/agents-packages-recieved-warehouse", [authMiddleware, authorized], async (req, res) => {
  try {
    let packages = await Sent_package.find({ state: "recieved-warehouse", $or: [{ receieverAgentID: req.query.agent }, { senderAgentID: req.query.agent }] }).sort({ createdAt: -1 }).limit(100)
      .populate('createdBy', 'f_name l_name name')
      .populate('receieverAgentID', 'business_name')
      .populate('senderAgentID', 'business_name')
      .populate('businessId')
    return res
      .status(200)
      .json(packages);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/agent-expired-packages", [authMiddleware, authorized], async (req, res) => {
  try {
    var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
    let packages
    if (req.query.searchKey) {
      packages = await Sent_package.find({ receieverAgentID: req.user._id, state: "delivered", updatedAt: { $lte: moment().subtract(4, 'days').toDate() }, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate('createdBy', 'f_name l_name name phone_number')
        .populate('receieverAgentID')
        .populate('senderAgentID')
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
      return res.status(200).json({ packages, "count": packages.length });
    } else {
      packages = await Sent_package.find({ receieverAgentID: req.user._id, state: "delivered", updatedAt: { $lte: moment().subtract(4, 'days').toDate() } })
        .populate('createdBy', 'f_name l_name name phone_number')
        .populate('receieverAgentID')
        .populate('senderAgentID')
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
      return res.status(200).json({ packages, "count": packages.length });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/agent-packages", [authMiddleware, authorized], async (req, res) => {
  try {
    let agent = await AgentUser.findOne({ user: req.user._id })
    const { period, state } = req.query
    let packages
    if (state === "rejected") {
      packages = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, state: state, })
        .populate("createdBy", "l_name f_name phone_number")
        .populate({
          path: 'senderAgentID',
          populate: {
            path: 'location_id',
          }
        })

        .populate({
          path: 'receieverAgentID',
          populate: {
            path: 'location_id',
          }
        })
        .populate("businessId", "name loc")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });
    }
    if (state === "request") {
      packages = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, state: state, })
        .populate("createdBy", "l_name f_name phone_number")

        .populate({
          path: 'senderAgentID',
          populate: {
            path: 'location_id',
          }
        })
        .populate({
          path: 'receieverAgentID',
          populate: {
            path: 'location_id',
          }
        })
        .populate("businessId", "name loc")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });
    }
    if (state === "delivered") {
      packages = await Sent_package.find({ payment_status: "paid", $or: [{ receieverAgentID: agent.agent },], state: state, })
        .populate("createdBy", "l_name f_name phone_number")
        .populate({
          path: 'senderAgentID',
          populate: {
            path: 'location_id',
          }``
        })
        // .populate("receieverAgentID")
        .populate({
          path: 'receieverAgentID',
          populate: {
            path: 'location_id',
          }
        })
        .populate("businessId", "name loc")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });
    }
    if (period === 0 || period === undefined || period === null) {

      packages = await Sent_package.find({ $or: [{ senderAgentID: agent.agent }, { receieverAgentID: agent.agent }], state: state, })
        .populate("createdBy", "l_name f_name phone_number")

        .populate({
          path: 'senderAgentID',
          populate: {
            path: 'location_id',
          }
        })
        // .populate("receieverAgentID")
        .populate({
          path: 'receieverAgentID',
          populate: {
            path: 'location_id',
          }
        })
        .populate("businessId", "name loc")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });

    }

    else if (period === 0 || period === undefined || period === null && req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ $or: [{ senderAgentID: agent.agent }], state: state, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID")
        .populate("receieverAgentID")

        .populate("businessId", "name loc")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });

    }
    else if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ agent: agent.agent, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID")

        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
    }
    else {
      packages = await Sent_package.find({ agent: agent.agent, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() } })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID",)
        .populate("receieverAgentID")

        .populate("businessId", "name")
        .sort({ createdAt: -1 });
    }
    return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });
  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/agent-packages-count", [authMiddleware, authorized], async (req, res) => {
  try {
    let agent = await AgentUser.findOne({ user: req.user._id })

    const { period, state } = req.query
    let packages

    if (period === 0 || period === undefined || period === null) {
      let packages = await Sent_package.find({ payment_status: "paid", state: state, });
      let dropped = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, state: "dropped" })
      let assigneWarehouse = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, state: "assigned-warehouse" })
      let warehouseTransit = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, state: "warehouse-transit" })
      let unavailable = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, state: "unavailable" })
      let picked = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, state: "picked" })
      let request = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, state: "request" })
      let delivered = await Sent_package.find({ payment_status: "paid", receieverAgentID: agent.agent, state: "delivered" })
      let collected = await Sent_package.find({ payment_status: "paid", receieverAgentID: agent.agent, state: "collected" })
      let rejected = await Sent_package.find({ payment_status: "paid", receieverAgentID: agent.agent, state: "rejected" })
      let onTransit = await Sent_package.find({ payment_status: "paid", receieverAgentID: agent.agent, state: "on-transit" })
      let cancelled = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, state: "cancelled" })
      let droppedToagent = await Sent_package.find({ payment_status: "paid", receieverAgentID: agent.agent, state: "dropped-to-agent" })
      let assigned = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, state: "assigned" })
      let recievedWarehouse = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, state: "recieved-warehouse" })
      let pickedfromSender = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, state: "picked-from-sender" })

      return res.status(200)
        .json({ message: "Fetched Sucessfully after", pickedfromSender: pickedfromSender.length, cancelled: cancelled.length, droppedToagent: droppedToagent.length, assigned: assigned.length, recievedWarehouse: recievedWarehouse.length, dropped: dropped.length, assigneWarehouse: assigneWarehouse.length, warehouseTransit: warehouseTransit.length, unavailable: unavailable.length, picked: picked.length, request: request.length, delivered: delivered.length, collected: collected.length, rejected: rejected.length, onTransit: onTransit.length });
    }

    else if (period === 0 || period === undefined || period === null && req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      let packages = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, state: state, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
      let dropped = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "dropped" })
      let assigneWarehouse = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "assigned-warehouse" })
      let warehouseTransit = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "warehouse-transit" })
      let unavailable = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "unavailable" })
      let picked = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "picked" })
      let request = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "request" })
      let delivered = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "delivered" })
      let collected = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "collected" })
      let rejected = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "rejected" })
      let onTransit = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "on-transit" })
      let cancelled = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "cancelled" })
      let droppedToagent = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "dropped-to-agent" })
      let assigned = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "assigned" })
      let recievedWarehouse = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "recieved-warehouse" })
      let pickedfromSender = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "picked-from-sender" })
      return res.status(200)
        .json({ message: "Fetched Sucessfully after", pickedfromSender: pickedfromSender.length, cancelled: cancelled.length, droppedToagent: droppedToagent.length, assigned: assigned.length, recievedWarehouse: recievedWarehouse.length, dropped: dropped.length, assigneWarehouse: assigneWarehouse.length, warehouseTransit: warehouseTransit.length, unavailable: unavailable.length, picked: picked.length, request: request.length, delivered: delivered.length, collected: collected.length, rejected: rejected.length, onTransit: onTransit.length });
    }

    else if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ payment_status: "paid", agent: agent.agent, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
      let dropped = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "dropped" })
      let assigneWarehouse = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "assigned-warehouse" })
      let warehouseTransit = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "warehouse-transit" })
      let unavailable = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "unavailable" })
      let picked = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "picked" })
      let request = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "request" })
      let delivered = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "delivered" })
      let collected = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "collected" })
      let rejected = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "rejected" })
      let onTransit = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "on-transit" })
      let cancelled = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "cancelled" })
      let droppedToagent = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "dropped-to-agent" })
      let assigned = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "assigned" })
      let recievedWarehouse = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "recieved-warehouse" })
      let pickedfromSender = await Sent_package.find({ payment_status: "paid", senderAgentID: agent.agent, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "picked-from-sender" })
      return res.status(200)
        .json({ message: "Fetched Sucessfully after", pickedfromSender: pickedfromSender.length, cancelled: cancelled.length, droppedToagent: droppedToagent.length, assigned: assigned.length, recievedWarehouse: recievedWarehouse.length, dropped: dropped.length, assigneWarehouse: assigneWarehouse.length, warehouseTransit: warehouseTransit.length, unavailable: unavailable.length, picked: picked.length, request: request.length, delivered: delivered.length, collected: collected.length, rejected: rejected.length, onTransit: onTransit.length });
    }


    else {
      packages = await Sent_package.find({ agent: agent.agent, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() } })
      let dropped = await Sent_package.find({ agent: agent.agent, state: "dropped" })
      let assigneWarehouse = await Sent_package.find({ agent: agent.agent, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "assigned-warehouse" })
      let warehouseTransit = await Sent_package.find({ agent: agent.agent, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "warehouse-transit" })
      let unavailable = await Sent_package.find({ agent: agent.agent, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "unavailable" })
      let picked = await Sent_package.find({ agent: agent.agent, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "picked" })
      let request = await Sent_package.find({ agent: agent.agent, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "request" })
      let delivered = await Sent_package.find({ agent: agent.agent, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "delivered" })
      let collected = await Sent_package.find({ agent: agent.agent, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "collected" })
      let rejected = await Sent_package.find({ agent: agent.agent, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "rejected" })
      let onTransit = await Sent_package.find({ agent: agent.agent, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "on-transit" })
      let cancelled = await Sent_package.find({ agent: agent.agent, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "cancelled" })
      let droppedToagent = await Sent_package.find({ agent: agent.agent, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "dropped-to-agent" })
      let assigned = await Sent_package.find({ agent: agent.agent, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "assigned" })
      let recievedWarehouse = await Sent_package.find({ agent: agent.agent, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "recieved-warehouse" })
      let pickedfromSender = await Sent_package.find({ agent: agent.agent, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "picked-from-sender" })
      return res.status(200)
        .json({ message: "Fetched Sucessfully after", pickedfromSender: pickedfromSender.length, cancelled: cancelled.length, droppedToagent: droppedToagent.length, assigned: assigned.length, recievedWarehouse: recievedWarehouse.length, dropped: dropped.length, assigneWarehouse: assigneWarehouse.length, warehouseTransit: warehouseTransit.length, unavailable: unavailable.length, picked: picked.length, request: request.length, delivered: delivered.length, collected: collected.length, rejected: rejected.length, onTransit: onTransit.length });
    }

  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/web/all-agent-packages/packages", [authMiddleware, authorized], async (req, res) => {

  try {
    let packages = await Sent_package.find()

    // .populate('createdBy', 'f_name l_name name')
    // .populate('receieverAgentID', 'business_name')
    // .populate('senderAgentID', 'business_name')
    // .populate('businessId')
    return res
      .status(200)
      .json(packages);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
})


router.get("/agent-packages-web", async (req, res) => {
  try {
    let packages

    if (req.query.agent !== "all") {
      packages = await Sent_package.find({ assignedTo: req.query.agent, state: req.query.state })
        .populate('createdBy', 'f_name l_name name phone_number')
        .populate('receieverAgentID')
        .populate('senderAgentID')
        .populate("businessId", "name")

    }
    else if (req.query.agent !== "all" && req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ assignedTo: req.query.agent, state: req.query.state, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate('createdBy', 'f_name l_name name phone_number')
        .populate('receieverAgentID')
        .populate('senderAgentID')
        .populate("businessId", "name")

    }
    else if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ assignedTo: req.query.agent, state: req.query.state, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate('createdBy', 'f_name l_name name phone_number')
        .populate('receieverAgentID')
        .populate('senderAgentID')
        .populate("businessId", "name")

    }
    else {
      packages = await Sent_package.find({ state: req.query.state })
        .populate('createdBy', 'f_name l_name name phone_number')
        .populate('receieverAgentID')
        .populate('senderAgentID')
        .populate("businessId", "name")
    }

    return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/reciever-agent-packages", [authMiddleware, authorized], async (req, res) => {

  try {
    let agent = await AgentUser.findOne({ user: req.user._id })

    const { period, state } = req.query
    let packages
    if (period === 0 || period === undefined || period === null) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')

      packages = await Sent_package.find({ payment_status: "paid", receieverAgentID: agent.agent, state: state })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID")
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });

    } else if (req.query.searchKey) {

      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ payment_status: "paid", receieverAgentID: agent.agent, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID")
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });

    }
    else if (state && req.query.searchKey) {

      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ payment_status: "paid", receieverAgentID: agent.agent, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID",)
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });
    }
    else {

      packages = await Sent_package.find({ payment_status: "paid", receieverAgentID: agent.agent, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() } })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID",)
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });
    }

  } catch (error) {

    console.log(error)
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/packages/agent/:id", async (req, res) => {
  try {
    const packages = await Sent_package.find({ receieverAgentID: req.params.id, state: "picked-from-sender" })
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
router.get("/user/agent/:id", async (req, res) => {
  try {
    const agent = await Agent.findOne({ user: req.params.id })
    return res.status(200).json(agent);
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

router.get("/commisions", [authMiddleware, authorized], async (req, res) => {
  try {
    const commisionArr = await Commision.find({
      agent: req.user._id,
    })
      .populate(["agent_package", "doorstep_package", "agent"])
      .populate({
        path: 'doorstep_package',
        populate: {
          path: 'businessId',
        }
      })
      .populate({
        path: 'agent_package',
        populate: {
          path: 'businessId',
        }
      })

    let grouped_commission = {}
    commisionArr.forEach(e => {
      // const [year, month] = e.createdAt.split('-')
      const date = new Date(e.createdAt).toISOString()
      const year = date.split('-')[0]
      const month = date.split('-')[1]

      grouped_commission[year] ??= {};
      grouped_commission[year][month] ??= [];
      grouped_commission[year][month].push(e);
    });


    return res.status(200).json(grouped_commission);
  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
// track agent_packages
router.get("/agent/track/packages", [authMiddleware, authorized], async (req, res) => {
  try {
    let packages
    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Track_agent_packages.find({ $or: [{ reciept: searchKey }] }).sort({ createdAt: -1 }).limit(100)
        .populate('package')
        .populate("collectedby")
      // .populate("droppedTo")
      return res.status(200)
        .json(packages);
    } else {
      packages = await Track_agent_packages.find().sort({ createdAt: -1 }).limit(100)
        .populate('package')
        .populate("collectedby")
        .populate({
          path: 'package',
          populate: {
            path: 'businessId',
          },
          populate: {
            path: 'assignedTo'
          },
          populate: {
            path: 'receieverAgentID'
          },
          populate: {
            path: 'senderAgentID'
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


router.get("/agent/track/packages/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    let packages
    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Track_agent_packages.findOne({ package: req.params.id, $or: [{ reciept: searchKey }] }).sort({ createdAt: -1 }).limit(100)
        .populate('package')
        .populate("collectedby")
      // .populate("droppedTo")
      return res.status(200)
        .json(packages);
    } else {
      packages = await Track_agent_packages.findOne({ package: req.params.id }).sort({ createdAt: -1 }).limit(100)

        .populate("collectedby")
        .populate({
          path: 'package',
          populate: {
            path: 'businessId',
          },
          populate: {
            path: 'assignedTo'
          },
          populate: {
            path: 'receieverAgentID'
          },
          populate: {
            path: 'senderAgentID'
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


module.exports = router;
