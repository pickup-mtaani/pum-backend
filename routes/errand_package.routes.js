const express = require("express");
var AgentDetails = require("models/agentAddmin.model");
var UnavailableDoorStep = require("models/unavailable_doorstep.model");
var Commision = require("models/commission.model");
var Declined = require("models/declined.model");
var Notification = require("models/notification.model");
var moment = require("moment");
var User = require('models/user.model')
const { v4: uuidv4 } = require('uuid');
var Track_Erand = require('models/erand_package_track.model');
var AgentUser = require('models/agent_user.model');
var Rejected = require('models/Rejected_parcels.model');
var Collected = require("models/collectors.model");
var Zone = require('models/agents.model');
var Courier = require('models/courier.model');
var Conversation = require('models/conversation.model')
var Sent_package = require("models/package.modal.js");
var Courrier = require("models/courier.model");
const Message = require("models/messages.model");
const _ = require('lodash');
var Erand_package = require("models/erand_delivery_packages.model");
var Rent_a_shelf_deliveries = require("models/rent_a_shelf_deliveries");
var Door_step_Sent_package = require("models/doorStep_delivery_packages.model");
var multer = require('multer');
const fs = require('fs');
var path = require('path');
var { authMiddleware, authorized } = require("middlewere/authorization.middlewere");
const Format_phone_number = require("../helpers/phone_number_formater");
const { SendMessage } = require("../helpers/sms.helper");
const Mpesa_stk = require("../helpers/stk_push.helper");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + './../uploads/errands');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, uuidv4() + '-' + fileName)
  }
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const router = express.Router();

router.put("/errand/package/:id/:state", [authMiddleware, authorized], async (req, res) => {
  try {
    let package = await Erand_package.findById(req.params.id)
    let narration = await Track_Erand.findOne({ package: req.params.id })
    let auth = await User.findById(req.user._id)
    let sender = await AgentDetails.findById(package?.agent)
    let courier
    let rider = await User.findOne({ _id: sender.rider })
    let newRider = await User.findOne({ _id: package.assignedTo })
    const { state } = req.params
    await Erand_package.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state }, { new: true, useFindAndModify: false })
    let seller = global.sellers?.find((sel) => sel.seller === `${package.createdBy}`)?.socket
    let notefications = []
    let expr = ""
    if (seller) {
      switch (state) {
        case "request":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 4, s_type: 1, descriptions: ` Package #${package.receipt_no}  created` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "picked-from-sender":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 4, s_type: 2, descriptions: ` Package #${package.receipt_no}  picked from sender` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "recieved-warehouse":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 4, s_type: 6, descriptions: ` Package #${package.receipt_no} recieved at the warehouse` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "assigned-warehouse":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 4, s_type: 7, descriptions: ` Package #${package.receipt_no}  assigned to a new rider` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "collected":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 4, s_type: 11, descriptions: ` Package #${package.receipt_no}  collected` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "warehouse-transit":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 4, s_type: 8, descriptions: ` Package #${package.receipt_no}  dispatched from warehouse` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "dropped-to-agent":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 4, s_type: 9, descriptions: ` Package #${package.receipt_no}  dropped to the recieving agent` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "declined":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 4, s_type: 11, descriptions: ` Package #${package.receipt_no}  rejected` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "droped":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 4, s_type: 5, descriptions: ` Package #${package.receipt_no}  dropped to the the warehouse` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "on-transit":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 4, s_type: 4, descriptions: ` Package #${package.receipt_no} on trans-it` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "assigned":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 4, s_type: 3, descriptions: ` Package #${package.receipt_no}  been assigned to a rider` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "delivered":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 4, s_type: 10, descriptions: ` Package #${package.receipt_no}  delivered` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "rejected":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 4, s_type: 0, descriptions: ` Package #${package.receipt_no}  rejected` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "early_collection":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 4, s_type: 0, descriptions: ` Package #${package.receipt_no}  booked for early collection` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        default:
          console.log(`Sorry, we are out of ${expr}.`);
      }
    }
    if (req.params.state === "picked-from-sender") {
      const package = await Erand_package.findById(req.params.id).populate("agent");
      if (sender?.hasShelf) {
        await Erand_package.findOneAndUpdate({ _id: req.params.id }, { state: "recieved-warehouse" }, { new: true, useFindAndModify: false })
      }
      let new_description = [...narration?.descriptions, {
        time: Date.now(), desc: `Drop off confimed  by ${auth?.name} at  ${sender.business_name} waiting for rider to collect`
      }]

      await Track_Erand.findOneAndUpdate({ package: req.params.id }, {
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
      await new Commision({ agent: req.user._id, Erand_package: req.params.id, commision: 0.1 * parseInt(payments) }).save()
    }
    if (req.params.state === "assigned") {
      p = await Erand_package.findOneAndUpdate({ _id: req.params.id }, { assignedTo: sender.rider }, { new: true, useFindAndModify: false })
      let new_description = [...narration?.descriptions, { time: Date.now(), desc: `Pkg ${package.receipt_no} assigned  to ${rider?.name} for delivery to Philadelphia house  ` }]
      await Track_Erand.findOneAndUpdate({ package: req.params.id }, {
        assigned: {
          assignedTo: package.assignedTo,
          // assignedAt: package?.senderAgentID?._id,
          assignedBy: req.user._id,
          assignedAt: moment()
        }, descriptions: new_description
      })
    }
    if (req.params.state === "on-transit") {

      let new_des = [...narration?.descriptions, { time: Date.now(), desc: `Pkg collected by rider ${rider.name} waiting to be dropped at sorting, Phildelphia Hse` }]

      await Track_Erand.findOneAndUpdate({ package: req.params.id }, {
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
      let new_des = [...narration?.descriptions, { time: Date.now(), desc: `Pkg dropped by rider ${rider.name} at sorting, Phildelphia Hse` }]
      await Track_Erand.findOneAndUpdate({ package: req.params.id }, {
        descriptions: new_des
      })

    }
    if (req.params.state === "assigned-warehouse") {
      let newrider = await User.findOne({ _id: req.query.assignedTo })

      let new_des = [...narration?.descriptions, { time: Date.now(), desc: `Pkg  assigned  by philadelphia sorting to ${newrider.name} heading to ${package.customerName}` }]

      await Track_Erand.findOneAndUpdate({ package: req.params.id }, {
        reAssigned:
        {
          reAssignedTo: req.query.assignedTo,
          reAssignedAt: Date.now(),
          reAssignedBy: req.user._id,
        }, descriptions: new_des
      }, { new: true, useFindAndModify: false })

      let v = await Erand_package.findOneAndUpdate({ _id: req.params.id }, {

        assignedTo: req.query.assignedTo,


      }, { new: true, useFindAndModify: false })

      return res.status(200).json({ message: "Sucessfully" });

    }
    if (req.params.state === "recieved-warehouse") {

      let new_des = [...narration?.descriptions, { time: Date.now(), desc: `Pkg  recieved at sorting  philadelphia and awaiting to  be assigned to rider for delivery to ${package.customerName} ` }]

      await Track_Erand.findOneAndUpdate({ package: req.params.id }, {
        warehouse:
        {
          recievedBy: req.user._id,

          warehouseAt: moment()
        }, descriptions: new_des
      }, { new: true, useFindAndModify: false })
      //await new DoorstepNarations({ package: req.params.id, state: req.params.state, descriptions: `Package dropped to warehouse` }).save()
    }
    if (req.params.state === "warehouse-transit") {
      let courier = await Courier.findOne({ _id: package.courier })
      let new_des = [...narration?.descriptions, { time: Date.now(), desc: `Pkg  accepted by ${newRider.name}  waiting drop off ${courier.name} for delivery to ,${package.customerName} ` }]
      await Track_Erand.findOneAndUpdate({ package: req.params.id }, {
        descriptions: new_des
      }, { new: true, useFindAndModify: false })

      // await new Narations({ package: req.params.id, state: req.params.state, descriptions: `Package dropped to warehouse` }).save()
    }
    if (req.params.state === "rejected") {

      let rejected = await new Rejected({ package: req.params.id, reject_reason: req.body.rejectReason }).save()
      await Erand_package.findOneAndUpdate({ _id: req.params.id }, { reject_Id: rejected._id }, { new: true, useFindAndModify: false })
      await Track_Erand.findOneAndUpdate({ package: req.params.id }, {
        rejected: {
          reason: req.body.rejectReason,
          rejectedAt: moment()
        }
      })

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
router.get("/errand-rider-package-count", [authMiddleware, authorized], async (req, res) => {
  try {
    let OnTransit = await Erand_package.find({ payment_status: "paid", state: "on-transit", assignedTo: req.user._id })
    let assigned = await Erand_package.find({ payment_status: "paid", state: "assigned", assignedTo: req.user._id })
    let warehouseTransit = await Erand_package.find({ payment_status: "paid", state: "warehouse-transit", assignedTo: req.user._id })
    let assignedWarehouse = await Erand_package.find({ payment_status: "paid", state: "assigned-warehouse", assignedTo: req.user._id })

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
router.get("/errand-package-count", [authMiddleware, authorized], async (req, res) => {
  try {

    let agent = await AgentUser.findOne({ user: req.user._id })
    let { id } = req.query

    let dropped = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "dropped" })
    let assigneWarehouse = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "assigned-warehouse" })
    let warehouseTransit = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "warehouse-transit" })
    let unavailable = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "unavailable" })
    let picked = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "picked" })
    let request = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "request" })
    let delivered = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "delivered" })
    let collected = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "collected" })
    let rejected = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "rejected" })
    let onTransit = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "on-transit" })
    let cancelled = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "cancelled" })
    let droppedToagent = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "dropped-to-agent" })
    let assigned = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "assigned" })
    let recievedWarehouse = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "recieved-warehouse" })
    let pickedfromSender = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], agent: id, state: "picked-from-sender" })
    return res.status(200)
      .json({ message: "Fetched Sucessfully after", pickedfromSender: pickedfromSender.length, cancelled: cancelled.length, droppedToagent: droppedToagent.length, assigned: assigned.length, recievedWarehouse: recievedWarehouse.length, dropped: dropped.length, assigneWarehouse: assigneWarehouse.length, warehouseTransit: warehouseTransit.length, unavailable: unavailable.length, picked: picked.length, request: request.length, delivered: delivered.length, collected: collected.length, rejected: rejected.length, onTransit: onTransit.length });


  } catch (error) {
    console.log(error)
  }
});
router.get("/notifications", [authMiddleware, authorized], async (req, res) => {
  try {
    let notefications = await Notification.find({ dispachedTo: req.user._id }).sort({ createdAt: -1 }).limit(9)

    return res.status(200)
      .json(notefications)

  } catch (error) {
    console.log(error)
  }
});
router.get("/errand-package-delivery-price", async (req, res) => {
  try {
    let agent = await AgentDetails.findOne({ _id: req.query.agent })
    let zon = await Zone.findOne({ _id: agent.location_id })

    let price = 100
    if (zon.name === "CBD - TOWN NAIROBI") {
      price = 70
    }
    return res.status(200)
      .json({ message: "Fetched Sucessfully after", price });


  } catch (error) {
    console.log(error)
  }
});

router.put("/errand/toogle-payment/:id", [authMiddleware, authorized], async (req, res) => {

  try {
    let paid = await Erand_package.findOneAndUpdate({ _id: req.params.id }, { payment_status: "paid" }, { new: true, useFindAndModify: false })
    return res
      .status(200)
      .json(paid);

  } catch (err) {
    console.log(err)
  }
})
router.get("/errand-packages", [authMiddleware, authorized], async (req, res) => {
  try {
    let period = 1000
    if (req.query.period) {
      period = req.query.period
    }
    let errand_packages

    const blended = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ assignedTo: req.user._id }, { agent: req.user._id }], $or: [{ state: "on-transit" }, { state: "complete" }, { state: "delivered" }, { state: "assigned" }] }).sort({ createdAt: -1 }).limit(1000)
      .populate('createdBy', 'f_name l_name name phone_number,')
      .populate('businessId').populate("agent").populate("courier")
    const agent = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ assignedTo: req.user._id }, { agent: req.user._id }], $or: [{ state: "request" }, { state: "picked-from-sender" }] }).sort({ createdAt: -1 }).limit(1000)
      .populate('createdBy', 'f_name l_name name phone_number,')
      .populate('businessId').populate("agent").populate("courier")

    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      errand_packages = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, assignedTo: req.user._id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] }).sort({ createdAt: -1 }).limit(1000)
        .populate('createdBy', 'f_name l_name name phone_number,').populate('businessId').populate("agent").populate("courier")
      return res
        .status(200)
        .json({ errand_packages, blended, agent });
    } else {

      errand_packages = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, assignedTo: req.user._id }).sort({ createdAt: -1 }).limit(1000)
        .populate('createdBy', 'f_name l_name name phone_number,').populate('businessId').populate("agent").populate("courier")
      return res
        .status(200)
        .json({ errand_packages, blended, agent });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/errand-agent-packages", [authMiddleware, authorized], async (req, res) => {
  try {

    let errand_packages
    const agent = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ assignedTo: req.user._id }, { agent: req.user._id }], $or: [{ state: "request" }, { state: "picked-from-sender" }] }).sort({ createdAt: -1 }).limit(1000)
      .populate('createdBy', 'f_name l_name name phone_number,')
      .populate('businessId').populate("agent").populate("courier")

    return res
      .status(200)
      .json({ errand_packages, blended, agent });

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

router.get("/errand-bussiness-packages", [authMiddleware, authorized], async (req, res) => {
  try {

    let { state, id } = req.query
    // console.log()
    let packages = await Erand_package.find({ agent: id, state: state })

    let agents_count = {}

    for (let i = 0; i < packages.length; i++) {
      let package = await Erand_package.findOne({ _id: [packages[i]._id] }).populate('businessId', "name")
      // console.log(package)

      agents_count[packages[i]?.businessId?.toString()] = agents_count[packages[i]?.businessId?.toString()] ?
        { packages: [...agents_count[packages[i]?.businessId?.toString()]?.packages, packages[i]._id], name: package?.businessId?.name }
        : { packages: [packages[i]._id], name: package?.businessId?.name }

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

router.put('/dispatch-errand/:id', [authMiddleware, authorized], upload.single('ticket'), async (req, res) => {
  try {
    const url = req.protocol + '://' + req.get('host');
    let package = await Erand_package.findById(req.params.id)
    let narration = await Track_Erand.findOne({ package: req.params.id })
    if (req.file) {

      const body = req.body
      // body.createdBy = req.body.user_id
      body.state = "collected",
        body.ticket = url + '/uploads/errand_dispaches' + req.file.filename

      let { customerPhoneNumber, payment_status, delivery_fee } = await Erand_package.findOne({ _id: req.params.id })
      req.body.package = req.params.id
      req.body.dispatchedBy = req.user._id
      let courier = await Courier.findOne({ _id: package.courier })
      await Erand_package.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
      let new_des = [...narration?.descriptions, { time: Date.now(), desc: `Pkg  delivered to ${courier.name}  waiting to be delivered to ${package.customerName} ` }]

      let v = await Track_Erand.findOneAndUpdate({ package: req.params.id }, {
        descriptions: new_des
      }, { new: true, useFindAndModify: false })

      return res.status(200).json("Parcel dispatched successfully");

      if (payment_status === "to-be-paid") {
        await Mpesa_stk(customerPhoneNumber, delivery_fee, req.user._id, "doorstep")
      }


    } else {
      return res.status(400).json("Reciept Image is Required");
    }



  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: 'operation failed ', error });
  }
});

router.get("/errand-agents-rider-packages", [authMiddleware, authorized], async (req, res) => {
  try {

    let { state } = req.query
    // console.log()
    let packages = await Erand_package.find({ assignedTo: req.user._id, state: state })

    let agents_count = {}

    for (let i = 0; i < packages.length; i++) {
      let package = await Erand_package.findOne({ _id: [packages[i]._id] }).populate('agent')
      agents_count[packages[i].agent.toString()] = agents_count[packages[i].agent.toString()] ?
        { packages: [...agents_count[packages[i]?.agent?.toString()]?.packages, packages[i]._id], name: package.agent.business_name } :
        { packages: [packages[i]._id], name: package.agent.business_name }

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
router.get("/seller-route-package-analytics", [authMiddleware, authorized], async (req, res) => {
  try {
    let v = await Erand_package.find({ createdBy: req.user._id })
    let Dpackages = await Door_step_Sent_package.find({ createdBy: req.user._id })
    let agentPackages = await Sent_package.find({ createdBy: req.user._id })
    let newDpackages = []
    let newagentPackages = []
    for (let i = 0; i < agentPackages.length; i++) {
      newagentPackages.push({ destination: agentPackages[i].toLocation, _id: agentPackages[i]._id })
    }
    for (let i = 0; i < Dpackages.length; i++) {
      newDpackages.push({ destination: Dpackages[i].toLocation, _id: Dpackages[i]._id })
    }
    const v1 = await v.concat(newagentPackages)
    const packages = await v1.concat(newDpackages)

    let agents_count = {}
    for (let i = 0; i < packages.length; i++) {
      agents_count[packages[i]?.destination?.toLowerCase()] = agents_count[packages[i]?.destination?.toLowerCase()] ?
        { packages: [...agents_count[packages[i]?.destination?.toLowerCase()]?.packages, packages[i]?._id], name: agents_count[packages[i]?.destination] } :
        { packages: [packages[i]?._id], name: agents_count[packages[i]?.destination] }

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

router.get("/errands-agents-rider-packages", [authMiddleware, authorized], async (req, res) => {
  try {
    let agents = []

    let { state } = req.query

    let packages = await Erand_package.find({ assignedTo: req.user._id, state: state })
    let agents_count = {}

    for (let i = 0; i < packages.length; i++) {

      agents_count[packages[i].agent.toString()] = agents_count[packages[i].agent.toString()] ? [...agents_count[packages[i].agent.toString()], packages[i]._id] : [packages[i]._id]

    }
    // console.log("first", agents_count)
    return res.status(200)
      .json(agents_count);

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

router.get("/errand-packages/:state/:id", [authMiddleware, authorized], async (req, res) => {
  try {

    const agent_packages = await Erand_package.find({
      agent: req.query.agent,
      $or: [
        { payment_status: "paid" },
        { payment_status: "to-be-paid" }
      ],
      state: req.params.state,
      businessId: req.params.id
    }).sort({ createdAt: -1 })
      .limit(1000)
      .populate('createdBy', 'f_name l_name name phone_number')
      .populate('businessId')
      .populate("courier")



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
router.get("/errand-agent-packages/:state/:id", [authMiddleware, authorized], async (req, res) => {
  try {

    if (req.params.id) {
      const agent_packages = await Erand_package.find({
        // agent: req.query.agent,
        $or: [
          { payment_status: "paid" },
          { payment_status: "to-be-paid" }
        ],
        state: req.params.state,
        agent: req.params.id
      }).sort({ createdAt: -1 })
        .limit(1000)
        .populate('createdBy', 'f_name l_name name phone_number')
        .populate('businessId')
        .populate("courier")

    } else {
      const agent_packages = await Erand_package.find({
        // agent: req.query.agent,
        $or: [
          { payment_status: "paid" },
          { payment_status: "to-be-paid" }
        ],
        state: req.params.state,

      }).sort({ createdAt: -1 })
        .limit(1000)
        .populate('createdBy', 'f_name l_name name phone_number')
        .populate('businessId')
        .populate("courier")

    }


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
router.get("/errand-packages-rider/:state", [authMiddleware, authorized], async (req, res) => {
  try {
    const agent_packages = await Erand_package.find({
      // agent: req.query.agent,
      $or: [
        { payment_status: "paid" },
        { payment_status: "to-be-paid" }
      ],
      state: req.params.state,
      assignedTo: req.user._id
    }).sort({ createdAt: -1 })
      .limit(1000)
      .populate('createdBy', 'f_name l_name name phone_number')
      .populate('businessId')
      .populate("courier")
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

router.get("/web-errand-packages", [authMiddleware, authorized], async (req, res) => {
  try {
    const agent_packages = await Erand_package.find().sort({ createdAt: 1 })
      .limit(1000)
      .populate('createdBy', 'f_name l_name name phone_number')
      .populate('businessId', "name")
      .populate("assignedTo", 'name')
      .populate("courier", "name")
      ;
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
router.get("/errand-rider-packages/:state/:id", [authMiddleware, authorized], async (req, res) => {
  try {

    const agent_packages = await Erand_package.find({ assignedTo: req.user._id, $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], state: req.params.state, businessId: req.params.id }).sort({ createdAt: -1 }).limit(1000).populate('createdBy', 'f_name l_name name phone_number').populate('businessId');
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
router.get("/errand-packages/:state", [authMiddleware, authorized], async (req, res) => {
  try {
    const agent = await AgentDetails.findOne({ user: req.user._id });

    const errand_packages = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], state: req.params.state, $or: [{ assignedTo: req.user._id }] }).sort({ createdAt: -1 }).limit(1000).populate('createdBy', 'f_name l_name name phone_number').populate('businessId').populate("courier").populate("agent");
    return res
      .status(200)
      .json(errand_packages);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/errand-search/:state", [authMiddleware, authorized], async (req, res) => {

  try {

    var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
    let agent_packages
    let { id } = req.query
    console.log(req.query)
    agent_packages = await Erand_package.find({ state: req.params.state, agent: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] }).sort({ createdAt: -1 }).limit(1000)
      .populate('createdBy', 'f_name l_name name')
      .populate('agent', 'business_name')
      .populate('businessId', 'name')
      .populate('courier', 'name')
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
router.get("/user-erand-packages/:id", [authMiddleware, authorized], async (req, res) => {
  try {

    let packages = {}

    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')


      packages.created = await Erand_package.find({ state: "request", createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        .populate("courier")
        .populate({
          path: 'agent',
          populate: {
            path: 'location_id',
          }
        })
        .sort({ createdAt: -1 })
        .limit(1000);
      packages.dropped = await Erand_package.findOne({ state: "picked-from-sender", createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        .populate({
          path: 'agent',
          populate: {
            path: 'location_id',
          }
        }).populate("courier")
        .sort({ createdAt: -1 })
        .limit(1000);
      packages.transit = await Erand_package.findOne({ $or: [{ state: "on-transit" }, { state: "warehouse-transit" }, { state: "assigned" }, { state: "dropped" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        .populate({
          path: 'agent',
          populate: {
            path: 'location_id',
          }
        }).populate("courier")
        .sort({ createdAt: -1 })
        .limit(1000);
      packages.warehouse = await Erand_package.findOne({ $or: [{ state: "recieved-warehouse" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        .populate({
          path: 'agent',
          populate: {
            path: 'location_id',
          }
        }).populate("courier")
        .sort({ createdAt: -1 })
        .limit(1000);

      packages.delivered = await Erand_package.findOne({ $or: [{ state: "dropped-to-agent" }, { state: "delivered" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        .populate({
          path: 'agent',
          populate: {
            path: 'location_id',
          }
        }).populate("courier")
        .sort({ createdAt: -1 })
        .limit(1000);
      packages.collected = await Erand_package.findOne({ $or: [{ state: "collected" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        .populate({
          path: 'agent',
          populate: {
            path: 'location_id',
          }
        }).populate("courier")
        .sort({ createdAt: -1 })
        .limit(1000);



    } else {

      packages.created = await Erand_package.find({ state: "request", createdBy: req.user._id, businessId: req.params.id })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        .populate({
          path: 'agent',
          populate: {
            path: 'location_id',
          }
        }).populate("courier")
        .sort({ createdAt: -1 })
        .limit(1000);
      packages.dropped = await Erand_package.find({ state: "picked-from-sender", createdBy: req.user._id, businessId: req.params.id })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        .populate({
          path: 'agent',
          populate: {
            path: 'location_id',
          }
        }).populate("courier")
        .sort({ createdAt: -1 })
        .limit(1000);
      packages.transit = await Erand_package.find({ $or: [{ state: "on-transit" }, { state: "warehouse-transit" }, { state: "assigned" }, { state: "dropped" }], createdBy: req.user._id, businessId: req.params.id })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        .populate({
          path: 'agent',
          populate: {
            path: 'location_id',
          }
        }).populate("courier")
        .sort({ createdAt: -1 })
        .limit(1000);
      packages.warehouse = await Erand_package.find({ $or: [{ state: "recieved-warehouse" }], createdBy: req.user._id, businessId: req.params.id })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        .populate({
          path: 'agent',
          populate: {
            path: 'location_id',
          }
        }).populate("courier")
        .sort({ createdAt: -1 })
        .limit(1000);

      packages.delivered = await Erand_package.find({ $or: [{ state: "dropped-to-agent" }, { state: "delivered" }], createdBy: req.user._id, businessId: req.params.id })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        .populate({
          path: 'agent',
          populate: {
            path: 'location_id',
          }
        }).populate("courier")
        .sort({ createdAt: -1 })
        .limit(1000);
      packages.collected = await Erand_package.find({ $or: [{ state: "collected" }], createdBy: req.user._id, businessId: req.params.id })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        .populate({
          path: 'agent',
          populate: {
            path: 'location_id',
          }
        }).populate("courier")
        .sort({ createdAt: -1 })
        .limit(1000);

    }

    return res
      .status(200)
      .json({
        message: "Fetched Sucessfully",
        packages,

      });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operationhj failed ", error });
  }
});


router.get("/rented-errand-packages", [authMiddleware, authorized], async (req, res) => {
  try {

    const errand_packages = await Erand_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], state: "pending-doorstep" }).sort({ createdAt: -1 }).limit(1000).populate('createdBy', 'f_name l_name name phone_number').populate('businessId').populate('agent');
    return res
      .status(200)
      .json(errand_packages);
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
      await Erand_package.findOneAndUpdate({ _id: req.body.package_id }, { payment_status: "paid" }, { new: true, useFindAndModify: false })

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
router.get("/wh-errand-packages/", [authMiddleware, authorized], async (req, res) => {
  try {
    const errand_packages = await Erand_package.find({ state: req.query.state }).sort({ createdAt: -1 }).limit(1000).populate('createdBy', 'f_name l_name name phone_number').populate('businessId').populate("courier").populate("agent");
    return res
      .status(200)
      .json(errand_packages);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/wh-errands-packages/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    const errand_packages = await Erand_package.find({ state: req.query.state, assignedTo: req.params.id }).sort({ createdAt: -1 }).limit(1000).populate('createdBy', 'f_name l_name name phone_number').populate('businessId').populate("courier").populate("agent");
    return res
      .status(200)
      .json(errand_packages);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
// track Doorstep packages

router.get("/errand/track/packages", [authMiddleware, authorized], async (req, res) => {
  try {
    let packages
    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Track_Erand.find({ $or: [{ reciept: searchKey }] }).sort({ createdAt: -1 }).limit(1000)
        .populate('package')
      // .populate("collectedby")
      // .populate("droppedTo")
      return res.status(200)
        .json(packages);
    } else {
      packages = await Track_Erand.find().sort({ createdAt: -1 }).limit(1000)
        .populate({
          path: 'package',
          populate: {
            path: 'agent',
          }
        })
        // .populate("collectedby")
        .populate({
          path: 'package',
          populate: {
            path: 'businessId',
          },

          populate: {
            path: 'assignedTo'
          },
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

router.get("/errand/track/packages/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    let packages
    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Track_Erand.findOne({ package: req.params.id, $or: [{ reciept: searchKey }] }).sort({ createdAt: -1 }).limit(1000)
        .populate('package')
      // .populate("collectedby")
      // .populate("droppedTo")
      return res.status(200)
        .json(packages);
    } else {
      packages = await Track_Erand.findOne({ package: req.params.id }).sort({ createdAt: -1 }).limit(1000)

        .populate('package')
        // .populate("collectedby")
        .populate({
          path: 'package',
          populate: {
            path: 'businessId',
          },
          populate: {
            path: 'agent',
          },
          populate: {
            path: 'assignedTo'
          },
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
router.post("/couriers", [authMiddleware, authorized], async (req, res) => {
  try {
    req.body.createdBy = req.user_id
    let courriers = await new Courrier(req.body).save();
    return res
      .status(200)
      .json(courriers);

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/couriers", [authMiddleware, authorized], async (req, res) => {
  try {
    let courriers = await Courrier.find({ checked: true, deletedAt: null })
    return res
      .status(200)
      .json(courriers);

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});



module.exports = router;
