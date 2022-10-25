const express = require("express");
var Collected = require("models/collectors.model");
var Unavailable = require("models/unavailable.model");
var Rider_Package = require('models/rider_package.model')
var Agent = require('models/agentAddmin.model')
var Sent_package = require("models/package.modal.js");
var Rider = require("models/rider.model");
var AgentUser = require('models/agent_user.model');
var Reject = require("models/Rejected_parcels.model");
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
const router = express.Router();
function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
router.put("/agent/package/:id/:state", [authMiddleware, authorized], async (req, res) => {

  try {
    const { type } = req.query
    let package = await Sent_package.findById(req.params.id).populate('senderAgentID')
    let rider = await Rider.findOne({ user: package.assignedTo })
    await Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state }, { new: true, useFindAndModify: false })
    if (req.params.state === "unavailable") {
      await new Unavailable({ package: req.params.id, reason: req.body.reason }).save()
    }

    if (req.params.state === "picked-from-sender") {
      const textbody = { address: Format_phone_number(`${package.customerPhoneNumber}`), Body: `Hi ${package.customerName}\nYour Package with reciept No ${package.receipt_no} has been  dropped at ${package?.senderAgentID?.name} and will be shipped to in 24hrs ` }
      await SendMessage(textbody)
      let payments = getRandomNumberBetween(100, 200)
      await new Commision({ agent: req.user._id, agent_package: req.params.id, commision: 0.1 * parseInt(payments) }).save()
    }
    if (req.params.state === "delivered") {
      const textbody = { address: Format_phone_number(`${package.customerPhoneNumber}`), Body: `Hi ${package.customerName}\nYour Package with reciept No ${package.receipt_no} has been  delivered at ${package?.senderAgentID?.name} and will be shipped to in 2hrs ` }
      await SendMessage(textbody)

    }
    if (req.params.state === "rejected") {
      await new Reject({ package: req.params.id, reject_reason: req.body.reason }).save()
    }
    if (req.params.state === "assigned") {
      await new Rider_Package({ package: req.params.id, rider: package.assignedTo }).save()

      await Rider.findOneAndUpdate({ user: package.assignedTo }, { no_of_packages: parseInt(rider.no_of_packages + 1) }, { new: true, useFindAndModify: false })
    }
    if (req.params.state === "assigned-warehouse") {

      await new Rider_Package({ package: req.params.id, rider: req.query.rider }).save()
      await Sent_package.findOneAndUpdate({ _id: req.params.id }, { assignedTo: req.query.rider }, { new: true, useFindAndModify: false })
      await Rider.findOneAndUpdate({ user: package.assignedTo }, { no_of_packages: parseInt(rider.no_of_packages + 1) }, { new: true, useFindAndModify: false })
    }
    if (req.params.state === "dropped" || req.params.state === "delivered" || req.params.state === "dropped-to-agent") {
      await Rider.findOneAndUpdate({ user: package.assignedTo }, { no_of_packages: parseInt(rider.no_of_packages - 1) }, { new: true, useFindAndModify: false })
    }
    if (req.params.state === "collected") {
      try {
        req.body.package = req.params.id
        req.body.dispatchedBy = req.user._id
        await new Collected(req.body).save()
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
    console.log(agent)
    var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
    let agent_packages
    if (req.query.searchKey) {
      agent_packages = await Sent_package.find({ agent: agent.agent, state: req.params.state, assignedTo: req.user._id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] }).sort({ createdAt: -1 }).limit(100)
        .populate('createdBy', 'f_name l_name name')
        .populate('receieverAgentID', 'business_name')
        .populate('senderAgentID', 'business_name')
        .populate('businessId')
      return res
        .status(200)
        .json(agent_packages);
    } else {
      agent_packages = await Sent_package.find({ agent: agent.agent, state: req.params.state, assignedTo: req.user._id }).sort({ createdAt: -1 }).limit(100)
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
    if (period === 0 || period === undefined || period === null) {
      let user = await AgentUser.findOne({ user: req.user._id, role: "agent", agent: req.params.agent })
      packages = await Sent_package.find({ agent: agent.agent, state: state, })
        .populate("createdBy", "l_name f_name phone_number")
        // .populate("senderAgentID")
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

    }

    else if (period === 0 || period === undefined || period === null && req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ agent: agent.agent, state: state, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID")
        .populate("receieverAgentID")
        .populate("businessId", "name loc")
        .sort({ createdAt: -1 });

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

module.exports = router;
