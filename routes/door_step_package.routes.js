const express = require("express");
var AgentDetails = require("models/agentAddmin.model");
var UnavailableDoorStep = require("models/unavailable_doorstep.model");
var Commision = require("models/commission.model");
var Declined = require("models/declined.model");
var moment = require("moment");
var Conversation = require('models/conversation.model')
const Message = require("models/messages.model");
var Door_step_Sent_package = require("models/doorStep_delivery_packages.model");
var {
  authMiddleware,
  authorized,
} = require("middlewere/authorization.middlewere");


function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const router = express.Router();

router.put("/door-step/package/:id/:state", [authMiddleware, authorized], async (req, res) => {
  try {
    const Owner = await Door_step_Sent_package.findById(req.params.id);
    await Door_step_Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state }, { new: true, useFindAndModify: false })
    if (req.params.state === "declined") {
      await new Declined({ package: req.params.id, reason: req.body.reason }).save()
    }
    if (req.params.state === "picked-from-sender") {
      const package = await Door_step_Sent_package.findById(req.params.id);
      let payments = getRandomNumberBetween(100, 200)
      await new Commision({ agent: req.user._id, doorstep_package: req.params.id, commision: 0.1 * parseInt(payments) }).save()
    }
    if (req.params.state === "on-transit") {
      const exists = await Conversation.findOne({
        "members": {
          $all: [
            req.user._id, Owner.createdBy
          ]
        }
      })
      if (exists) {
        await Conversation.findOneAndUpdate({ _id: exists._id }, { updated_at: new Date(), last_message: 'Hi  been assigned your package kindly feel free to chat' }, { new: true, useFindAndModify: false })
        await new Message({ conversationId: exists._id, sender: req.user_id, text: `Hi  been assigned your package kindly feel free to chat` }).save()
      } else {
        const newConversation = new Conversation({
          members: [req.user._id, Owner.createdBy]
        });

        await newConversation.save()

      }

    }
    if (req.params.state === "unavailable") {
      await new UnavailableDoorStep({ package: req.params.id, reason: req.body.reason }).save()
    }
    return res.status(200).json({ message: "Sucessfully" });

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/door-step-packages", [authMiddleware, authorized], async (req, res) => {

  try {
    let period = 1000
    if (req.query.period) {
      period = req.query.period
    }
    console.log("period: " + period);
    const blended = await Door_step_Sent_package.find({ updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ assignedTo: req.user._id }, { agent: req.user._id }], $or: [{ state: "on-transit" }, { state: "complete" }, { state: "delivered" }, { state: "assigned" }] }).sort({ createdAt: -1 }).limit(100)
      .populate('createdBy', 'f_name l_name name phone_number,')
      .populate('businessId')
    const agent = await Door_step_Sent_package.find({ updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ assignedTo: req.user._id }, { agent: req.user._id }], $or: [{ state: "request" }, { state: "picked-from-sender" }] }).sort({ createdAt: -1 }).limit(100)
      .populate('createdBy', 'f_name l_name name phone_number,')
      .populate('businessId')

    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      agent_packages = await Door_step_Sent_package.find({ updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, assignedTo: req.user._id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] }).sort({ createdAt: -1 }).limit(100)
        .populate('createdBy', 'f_name l_name name phone_number,').populate('businessId')
      return res
        .status(200)
        .json({ agent_packages, blended, agent });
    } else {

      agent_packages = await Door_step_Sent_package.find({ updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, assignedTo: req.user._id }).sort({ createdAt: -1 }).limit(100)
        .populate('createdBy', 'f_name l_name name phone_number,').populate('businessId')
      return res
        .status(200)
        .json({ agent_packages, blended, agent });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

router.get("/door-step-packages/:state", [authMiddleware, authorized], async (req, res) => {
  try {
    const agent = await AgentDetails.findOne({ user: req.user._id });
    const agent_packages = await Door_step_Sent_package.find({ state: req.params.state, $or: [{ assignedTo: req.user._id }, { agent: agent._id }] }).sort({ createdAt: -1 }).limit(100).populate('createdBy', 'f_name l_name name phone_number');
    return res
      .status(200)
      .json(agent_packages);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/wh-door-step-packages/", [authMiddleware, authorized], async (req, res) => {
  try {
    const agent_packages = await Door_step_Sent_package.find({ state: req.query.state }).sort({ createdAt: -1 }).limit(100).populate('createdBy', 'f_name l_name name phone_number');
    return res
      .status(200)
      .json(agent_packages);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});


module.exports = router;
