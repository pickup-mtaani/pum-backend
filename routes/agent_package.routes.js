const express = require("express");
var Rent = require("models/rent_a_shelf_delivery.model");
var Rent_a_shelf_deliveries = require("models/rent_a_shelf_deliveries");
var Agent = require("models/agents.model");
var AgentDetails = require("models/agentAddmin.model");
var Collected = require("models/collectors.model");
var Unavailable = require("models/unavailable.model");
var UnavailableDoorStep = require("models/unavailable_doorstep.model");
var Declined = require("models/declined.model");
var Bussiness = require("models/business.model");
var BussinessDetails = require("models/business_details.model");
var Conversation = require('models/conversation.model')
const Message = require("models/messages.model");
var Product = require("models/products.model.js");
var User = require("models/user.model.js")
var Rider_Package = require('models/rider_package.model')
var Sent_package = require("models/package.modal.js");
var Door_step_Sent_package = require("models/doorStep_delivery_packages.model");
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
router.put("/agent/package/:id/:state", [authMiddleware, authorized], async (req, res) => {
  try {
    const { type } = req.query
    await Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state }, { new: true, useFindAndModify: false })
    if (req.params.state === "unavailable") {
      await new Unavailable({ package: req.params.id, reason: req.body.reason }).save()
    }
    if (req.params.state === "rejected") {
      await new Reject({ package: req.params.id, reject_reason: req.body.reason }).save()
    }
    if (req.params.state === "assigned" || req.params.state === "assigned-warehouse") {
      await new Rider_Package({ package: req.params.id, rider: req.query.rider }).save()
      await Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state, assignedTo: req.query.rider }, { new: true, useFindAndModify: false })
    }
    if (req.params.state === "collected") {
      req.body.package = req.params.id
      req.body.dispatchedBy = req.user._id
      await new Collected(req.body).save()
      // await Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state, assignedTo: req.query.rider }, { new: true, useFindAndModify: false })
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
    var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
    let agent_packages
    if (req.query.searchKey) {
      agent_packages = await Sent_package.find({ state: req.params.state, assignedTo: req.user._id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] }).sort({ createdAt: -1 }).limit(100)
        .populate('createdBy', 'f_name l_name name')
        .populate('receieverAgentID', 'name')
        .populate('senderAgentID', 'name')
      return res
        .status(200)
        .json(agent_packages);
    } else {
      agent_packages = await Sent_package.find({ state: req.params.state, assignedTo: req.user._id }).sort({ createdAt: -1 }).limit(100)
        .populate('createdBy', 'f_name l_name name')
        .populate('receieverAgentID', 'name')
        .populate('senderAgentID', 'name')
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

    const { period, state } = req.query
    let packages
    if (period === 0 || period === undefined || period === null) {
      packages = await Sent_package.find({ senderAgentID: req.user._id, state: state, })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID")
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });

    }

    else if (period === 0 || period === undefined || period === null && req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ senderAgentID: req.user._id, state: state, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID")
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });

    }
    else if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ senderAgentID: req.user._id, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID")
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });

    }
    else {
      packages = await Sent_package.find({ senderAgentID: req.user._id, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() } })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID",)
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
    }
    return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
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
    const { period, state } = req.query
    let packages
    if (period === 0 || period === undefined || period === null) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ receieverAgentID: req.user._id, state: state, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID")
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });

    } else if (req.query.searchKey) {

      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ receieverAgentID: req.user._id, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID")
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });

    }
    else if (state && req.query.searchKey) {

      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ receieverAgentID: req.user._id, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID",)
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });
    }
    else {

      packages = await Sent_package.find({ receieverAgentID: req.user._id, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() } })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID",)
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });
    }

  } catch (error) {
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

module.exports = router;
