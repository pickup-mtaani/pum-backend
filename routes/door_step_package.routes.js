const express = require("express");
var AgentDetails = require("models/agentAddmin.model");
var UnavailableDoorStep = require("models/unavailable_doorstep.model");
var Commision = require("models/commission.model");
var DoorstepNarations = require('models/door_step_narations.model');
var Declined = require("models/declined.model");
var moment = require("moment");
var Reject = require("models/Rejected_parcels.model");
var User = require('models/user.model')
var AgentUser = require('models/agent_user.model');
var Collected = require("models/collectors.model");
var Conversation = require('models/conversation.model')
var Sent_package = require("models/package.modal.js");
const Message = require("models/messages.model");
var Door_step_Sent_package = require("models/doorStep_delivery_packages.model");
var Rent_a_shelf_deliveries = require("models/rent_a_shelf_deliveries");
var Track_door_step = require('models/door_step_package_track.model');
var Notification = require("models/notification.model");
var {
  authMiddleware,
  authorized,
} = require("middlewere/authorization.middlewere");
const Format_phone_number = require("../helpers/phone_number_formater");
const { SendMessage } = require("../helpers/sms.helper");
const Mpesa_stk = require("../helpers/stk_push.helper");
const router = express.Router();

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


router.put("/door-step/package/:id/:state", [authMiddleware, authorized], async (req, res) => {
  try {
    const package = await Door_step_Sent_package.findById(req.params.id);
    let seller = global.sellers?.find((sel) => sel.seller === `${package.createdBy}`)?.socket
    let notefications = []
    let auth = await User.findById(req.user._id)
    let narration = await Track_door_step.findOne({ package: req.params.id })
    let sender = await AgentDetails.findById(package?.agent)

    let rider = await User.findById(sender?.rider)
    const { state } = req.params
    let p
    let expr = ""
    if (seller) {
      switch (state) {
        case "request":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 2, s_type: 1, descriptions: ` Package #${package.receipt_no}  created` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "picked-from-sender":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 2, s_type: 2, descriptions: ` Package #${package.receipt_no}  picked from sender` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "recieved-warehouse":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 2, s_type: 6, descriptions: ` Package #${package.receipt_no} recieved at the warehouse` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "assigned-warehouse":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 2, s_type: 7, descriptions: ` Package #${package.receipt_no}  assigned to a new rider` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "collected":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 2, s_type: 11, descriptions: ` Package #${package.receipt_no}  collected` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "warehouse-transit":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 2, s_type: 8, descriptions: ` Package #${package.receipt_no}  dispatched from warehouse` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "dropped-to-agent":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 2, s_type: 9, descriptions: ` Package #${package.receipt_no}  dropped to the recieving agent` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "declined":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 2, s_type: 11, descriptions: ` Package #${package.receipt_no}  rejected` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "droped":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 2, s_type: 5, descriptions: ` Package #${package.receipt_no}  dropped to the the warehouse` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "on-transit":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 2, s_type: 4, descriptions: ` Package #${package.receipt_no} on trans-it` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "assigned":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 2, s_type: 3, descriptions: ` Package #${package.receipt_no}  been assigned to a rider` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "delivered":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 2, s_type: 10, descriptions: ` Package #${package.receipt_no}  been assigned to a rider from the warehouse` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "rejected":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 2, s_type: 0, descriptions: ` Package #${package.receipt_no}  been assigned to a rider from the warehouse` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;

        default:
          console.log(`Sorry, we are out of ${expr}.`);
      }
    }

    await Door_step_Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state }, { new: true, useFindAndModify: false })
    if (req.params.state === "declined") {
      await new Declined({ package: req.params.id, reason: req.body.reason }).save()
    }
    if (req.params.state === "picked-from-sender") {
      const package = await Door_step_Sent_package.findById(req.params.id).populate("agent");
      if (sender?.hasShelf) {
        await Door_step_Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: "recieved-warehouse" }, { new: true, useFindAndModify: false })
      }
      let new_description = [...narration.descriptions, {
        time: Date.now(), desc: `Drop off confimed  by ${auth?.name} at  ${sender.business_name} waiting for rider to collect`
      }]

      await Track_door_step.findOneAndUpdate({ package: req.params.id }, {
        dropped: {
          droppedBy: package.assignedTo,
          droppedTo: package?.senderAgentID?._id,
          recievedBy: req.user._id,
          droppedAt: moment()
        },
        descriptions: new_description

      }, { new: true, useFindAndModify: false })
      const textbody = { address: Format_phone_number(`${package.customerPhoneNumber}`), Body: `Hi ${package.customerName}\nYour Package with reciept No ${package.receipt_no} has been  dropped at ${package?.agent?.business_name} and will be shipped to you in 24hrs ` }
      await SendMessage(textbody)
      let payments = getRandomNumberBetween(100, 200)
      await new Commision({ agent: req.user._id, doorstep_package: req.params.id, commision: 0.1 * parseInt(payments) }).save()
    }
    if (req.params.state === "assigned") {
      p = await Door_step_Sent_package.findOneAndUpdate({ _id: req.params.id }, { assignedTo: sender.rider }, { new: true, useFindAndModify: false })
      let rider = await User.findOne({ _id: sender.rider })
      let new_description = [...narration?.descriptions, { time: Date.now(), desc: `Pkg ${package.receipt_no} assigned  to ${rider?.name} for delivery to Philadelphia house  ` }]
      await Track_door_step.findOneAndUpdate({ package: req.params.id }, {
        assigned: {
          assignedTo: package.assignedTo,
          // assignedAt: package?.senderAgentID?._id,
          assignedBy: req.user._id,
          assignedAt: moment()
        }, descriptions: new_description
      })
    }
    if (req.params.state === "on-transit") {

      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg collected by rider ${rider.name} waiting to be dropped at sorting, Phildelphia Hse` }]

      await Track_door_step.findOneAndUpdate({ package: req.params.id }, {
        accepted:
        {
          acceptedBy: package?.assignedTo,
          acceptedAt: moment(),

        },
        descriptions: new_des
      }, { new: true, useFindAndModify: false })

      const exists = await Conversation.findOne({
        "members": {
          $all: [
            req.user._id, package.createdBy
          ]
        }
      })


      if (exists) {
        await Conversation.findOneAndUpdate({ _id: exists._id }, { updated_at: new Date(), last_message: 'Hi  been assigned your package kindly feel free to chat' }, { new: true, useFindAndModify: false })
        await new Message({ conversationId: exists._id, sender: req.user_id, text: `Hi  been assigned your package kindly feel free to chat` }).save()
      } else {
        const newConversation = new Conversation({
          members: [req.user._id, package.createdBy]
        });

        await newConversation.save()

      }
    }
    if (req.params.state === "dropped") {
      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg dropped by rider ${rider.name} at sorting, Phildelphia Hse` }]
      await Track_door_step.findOneAndUpdate({ package: req.params.id }, {
        descriptions: new_des
      })

    }
    if (req.params.state === "assigned-warehouse") {
      let newrider = await User.findOne({ _id: req.query.assignedTo })

      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg  assigned  by philadelphia sorting to ${newrider.name}  to deliver to  ${package.customerName}` }]

      await Track_door_step.findOneAndUpdate({ package: req.params.id }, {
        reAssigned:
        {
          reAssignedTo: req.query.assignedTo,
          reAssignedAt: Date.now(),
          reAssignedBy: req.user._id,
        }, descriptions: new_des
      }, { new: true, useFindAndModify: false })


    }
    if (req.params.state === "recieved-warehouse") {

      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg  recieved at sorting  philadelphia and awaiting to  be assigned to rider for delivery to ${package.customerName} ` }]

      await Track_door_step.findOneAndUpdate({ package: req.params.id }, {
        warehouse:
        {
          recievedBy: req.user._id,

          warehouseAt: moment()
        }, descriptions: new_des
      }, { new: true, useFindAndModify: false })
      //await new DoorstepNarations({ package: req.params.id, state: req.params.state, descriptions: `Package dropped to warehouse` }).save()
    }
    if (req.params.state === "warehouse-transit") {
      // package
      let newrider = await User.findOne({ _id: package.assignedTo })
      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg  collected by rider  ${newrider.name} heading to ${package.customerName} ` }]
      await Track_door_step.findOneAndUpdate({ package: req.params.id }, {
        descriptions: new_des
      }, { new: true, useFindAndModify: false })
      //await new DoorstepNarations({ package: req.params.id, state: req.params.state, descriptions: `Package dropped to warehouse` }).save()
    }
    if (req.params.state === "rejected") {
      let rejected = await new Reject({ package: req.params.id, reject_reason: req.body.rejectReason }).save()
      await Door_step_Sent_package.findOneAndUpdate({ _id: req.params.id }, { reject_Id: rejected._id }, { new: true, useFindAndModify: false })
      await Track_door_step.findOneAndUpdate({ package: req.params.id }, {
        rejected: {

          reason: req.body.rejectReason,
          rejectedAt: moment()
        }
      })

    }
    if (req.params.state === "collected") {
      req.body.package3 = req.params.id
      req.body.dispatchedBy = req.user._id
      req.body.type = "doorstep"
      let collector = await new Collected(req.body).save()
      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg given out to ${req.body.collector_name} of ID no ${req.body.collector_national_id} phone No 0${req.body.collector_phone_number.substring(1, 4)}xxx xxxx   ` }]
      await Track_door_step.findOneAndUpdate({ package: req.params.id }, {
        descriptions: new_des
      }, { new: true, useFindAndModify: false })
    }

    if (req.params.state === "unavailable") {
      await new UnavailableDoorStep({ package: req.params.id, reason: req.body.reason }).save()
    }
    let t = await Door_step_Sent_package.findOne({ _id: req.params.id })

    return res.status(200).json({ message: "Sucessfully", t });

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/door-step-package-count", [authMiddleware, authorized], async (req, res) => {
  try {

    let { id } = req.query

    let dropped = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "dropped" })
    let assigneWarehouse = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "assigned-warehouse" })
    let warehouseTransit = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "warehouse-transit" })
    let unavailable = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "unavailable" })
    let picked = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "picked" })
    let request = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "request" })
    let delivered = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "delivered" })
    let collected = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "collected" })
    let rejected = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "rejected" })
    let onTransit = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "on-transit" })
    let cancelled = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "cancelled" })
    let droppedToagent = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "dropped-to-agent" })
    let assigned = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "assigned" })
    let recievedWarehouse = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "recieved-warehouse" })
    let pickedfromSender = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "picked-from-sender" })
    return res.status(200)
      .json({ message: "Fetched Sucessfully after", pickedfromSender: pickedfromSender.length, cancelled: cancelled.length, droppedToagent: droppedToagent.length, assigned: assigned.length, recievedWarehouse: recievedWarehouse.length, dropped: dropped.length, assigneWarehouse: assigneWarehouse.length, warehouseTransit: warehouseTransit.length, unavailable: unavailable.length, picked: picked.length, request: request.length, delivered: delivered.length, collected: collected.length, rejected: rejected.length, onTransit: onTransit.length });


  } catch (error) {
    console.log(error)
  }
});
router.get("/door-step-package-narations/:id", [authMiddleware, authorized], async (req, res) => {
  try {

    let narations = await DoorstepNarations.find({ package: req.params.id }).sort({ createdAt: -1 })
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
router.put("/doorstep/toogle-payment/:id", [authMiddleware, authorized], async (req, res) => {

  try {
    let paid = await Door_step_Sent_package.findOneAndUpdate({ _id: req.params.id }, { payment_status: "paid" }, { new: true, useFindAndModify: false })
    return res
      .status(200)
      .json(paid);

  } catch (err) {
    console.log(err)
  }
})
router.get("/door-step-packages", [authMiddleware, authorized], async (req, res) => {
  try {


    let period = 1000
    if (req.query.period) {
      period = req.query.period
    }

    const blended = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ assignedTo: req.user._id }, { agent: req.user._id }], $or: [{ state: "on-transit" }, { state: "collected" }, { state: "delivered" }, { state: "assigned" }] }).sort({ createdAt: -1 }).limit(100)
      .populate('createdBy', 'f_name l_name name phone_number,')
      .populate('businessId')
    const agent = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ assignedTo: req.user._id }, { agent: req.user._id }], $or: [{ state: "request" }, { state: "picked-from-sender" }] }).sort({ createdAt: -1 }).limit(100)
      .populate('createdBy', 'f_name l_name name phone_number,')
      .populate('businessId')

    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      agent_packages = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, assignedTo: req.user._id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] }).sort({ createdAt: -1 }).limit(100)
        .populate('createdBy', 'f_name l_name name phone_number,').populate('businessId')
      return res
        .status(200)
        .json({ agent_packages, blended, agent });
    } else {

      agent_packages = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, assignedTo: req.user._id }).sort({ createdAt: -1 }).limit(100)
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
router.get("/doorstep-rider-package-count", [authMiddleware, authorized], async (req, res) => {

  try {
    let OnTransit = await Door_step_Sent_package.find({ payment_status: "paid", state: "on-transit", assignedTo: req.user._id })
    let assigned = await Door_step_Sent_package.find({ payment_status: "paid", state: "assigned", assignedTo: req.user._id })
    let warehouseTransit = await Door_step_Sent_package.find({ payment_status: "paid", state: "warehouse-transit", assignedTo: req.user._id })
    let assignedWarehouse = await Door_step_Sent_package.find({ payment_status: "paid", state: "assigned-warehouse", assignedTo: req.user._id })

    return res
      .status(200)
      .json({ OnTransit: OnTransit.length, assigned: assigned.length, warehouseTransit: warehouseTransit.length, assignedWarehouse: assignedWarehouse.length });

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/doorstep-agents-rider-packages", [authMiddleware, authorized], async (req, res) => {
  try {

    let { state } = req.query
    let packages = await Door_step_Sent_package.find({ assignedTo: req.user._id, state: state })
    let agents_count = {}

    for (let i = 0; i < packages.length; i++) {

      agents_count[packages[i].agent.toString()] = agents_count[packages[i].agent.toString()] ? [...agents_count[packages[i].agent.toString()], packages[i]._id] : [packages[i]._id]
    }
    return res.status(200)
      .json(agents_count);

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/door-step-packages/:state", [authMiddleware, authorized], async (req, res) => {
  try {
    const agent_packages = await Door_step_Sent_package.find({ state: req.params.state, $or: [{ assignedTo: req.user._id }, { agent: req.user._id }] }).sort({ createdAt: -1 }).limit(100).populate('createdBy', 'f_name l_name name phone_number').populate('businessId');
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
router.get("/door-step-agent-packages", [authMiddleware, authorized], async (req, res) => {
  try {
    let { state, id } = req.query

    let packages = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], state: state, agent: id })

    let agents_count = {}

    for (let i = 0; i < packages.length; i++) {
      let package = await Door_step_Sent_package.findOne({ _id: [packages[i]._id] }).populate('businessId')
      agents_count[packages[i]?.businessId?.toString()] = agents_count[packages[i]?.businessId?.toString()] ?
        { packages: [...agents_count[packages[i]?.businessId?.toString()]?.packages, packages[i]._id], name: package.businessId.name }
        : { packages: [packages[i]._id], name: package.businessId.name }
    }

    return res.status(200)
      .json(agents_count);

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/door-step-agent-packages/:state/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    console.log("req.query")
    const agent_packages = await Door_step_Sent_package.find({ agent: req.query.agent, $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], state: req.params.state, businessId: req.params.id }).sort({ createdAt: -1 }).limit(100).populate('createdBy', 'f_name l_name name phone_number').populate('businessId');
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
// singlr business packages 
router.get("/door-step-rider-packages/:state/:id", [authMiddleware, authorized], async (req, res) => {
  try {

    const agent_packages = await Door_step_Sent_package.find({ assignedTo: req.user._id, $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], state: req.params.state, agent: req.params.id }).sort({ createdAt: -1 }).limit(100).populate('createdBy', 'f_name l_name name phone_number').populate('businessId');
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
router.get("/doorstep-agent-search/:state", [authMiddleware, authorized], async (req, res) => {

  try {

    var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
    let agent_packages
    let { id } = req.query
    console.log(req.query)
    agent_packages = await Door_step_Sent_package.find({ state: req.params.state, $or: [{ agent: id }], $or: [{ packageName: searchKey }, { receipt_no: searchKey }] }).sort({ createdAt: -1 }).limit(100)
      .populate('createdBy', 'f_name l_name name')
      .populate('agent', 'business_name')
      .populate('businessId', 'name')
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
router.get("/rented-door-step-packages", [authMiddleware, authorized], async (req, res) => {
  try {

    const agent_packages = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], state: "pending-doorstep" }).sort({ createdAt: -1 }).limit(100).populate('createdBy', 'f_name l_name name phone_number').populate('businessId').populate('agent');
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

router.post("/pay-on-delivery", [authMiddleware, authorized], async (req, res) => {
  try {
    let v = await Mpesa_stk(req.body.phone_number, 1, 1, req.body.type)
    if (req.body.type === "doorstep") {

    } else if (req.body.type == "rent") {
      await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: req.body.package_id, }, { hasBalance: false }, { new: true, useFindAndModify: false })
    } else {
      await Sent_package.findOneAndUpdate({ _id: req.body.package_id, }, { hasBalance: false }, { new: true, useFindAndModify: false })

    }
    return res
      .status(200)
      .json(v);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});


router.get("/agents_routes", [authMiddleware, authorized], async (req, res) => {
  try {

    const agents = await AgentDetails.find().sort({ createdAt: -1 }).limit(100);
    console.log(agents)
    return res
      .status(200)
      .json(agents);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

module.exports = router;
