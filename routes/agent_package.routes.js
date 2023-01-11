const express = require("express");
var Collected = require("models/collectors.model");
var Unavailable = require("models/unavailable.model");
var Rider_Package = require('models/rider_package.model')
var Narations = require('models/agent_agent_narations.model');
var Agent = require('models/agentAddmin.model')
var User = require('models/user.model')
var Sent_package = require("models/package.modal.js");
var AgentDetails = require("models/agentAddmin.model");
var Reject = require("models/Rejected_parcels.model");
var Track_agent_packages = require('models/agent_package_track.model');
var Notification = require("models/notification.model");
var RiderRoutes = require('models/rider_routes.model')
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
const { request } = require("express");
const Mpesa_stk = require("../helpers/stk_push.helper");
const router = express.Router();
function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

router.put("/agent/package-update/:id", [authMiddleware, authorized], async (req) => {
  try {

    await Sent_package.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
  } catch (error) {
    console.log(error)
  }

})
router.put("/agent/package/:id/:state", [authMiddleware, authorized], async (req, res) => {
  try {
    const { type, } = req.query
    let auth = await User.findById(req.user._id)
    let package = await Sent_package.findById(req.params.id).populate('senderAgentID')
    let sender = await AgentDetails.findById(package?.senderAgentID)

    // let sender = await AgentDetails.findOne({ user: auth?._id })
    let reciever = await AgentDetails.findById(package.receieverAgentID)

    let rider = await User.findOne({ _id: sender.rider })
    let recRider = await User.findOne({ _id: package.assignedTo })

    let narration = await Track_agent_packages.findOne({ package: req.params.id })
    let notefications = []
    let seller = global.sellers?.find((sel) => sel.seller === `${package.createdBy}`)?.socket
    const { state } = req.params
    await Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state }, { new: true, useFindAndModify: false })
    let expr = ""
    if (seller) {
      switch (state) {
        case "request":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 1, s_type: 1, descriptions: ` Package #${package.receipt_no}  created` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "picked-from-sender":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 1, s_type: 2, descriptions: ` Package #${package.receipt_no}  picked from sender` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "recieved-warehouse":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 1, s_type: 6, descriptions: ` Package #${package.receipt_no} recieved at the warehouse` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "assigned-warehouse":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 1, s_type: 7, descriptions: ` Package #${package.receipt_no}  assigned to a new rider` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "collected":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 1, s_type: 11, descriptions: ` Package #${package.receipt_no}  collected` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "warehouse-transit":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 1, s_type: 8, descriptions: ` Package #${package.receipt_no}  dispatched from warehouse` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "dropped-to-agent":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 1, s_type: 9, descriptions: ` Package #${package.receipt_no}  dropped to the recieving agent` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "declined":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 1, s_type: 11, descriptions: ` Package #${package.receipt_no}  rejected` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "droped":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 1, s_type: 5, descriptions: ` Package #${package.receipt_no}  dropped to the the warehouse` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "on-transit":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 1, s_type: 4, descriptions: ` Package #${package.receipt_no} on trans-it` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "assigned":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 1, s_type: 3, descriptions: ` Package #${package.receipt_no}  been assigned to a rider` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "delivered":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 1, s_type: 10, descriptions: ` Package #${package.receipt_no}  been assigned to a rider from the warehouse` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        default:
          console.log(`Sorry, we are out of ${expr}.`);
      }
    }

    if (req.params.state === "unavailable") {
      await new Unavailable({ package: req.params.id, reason: req.body.reason }).save()
    }
    if (req.params.state === "rejected") {
      let reject = await new Reject({ package: req.params.id, reject_reason: req.body.rejectReason }).save()
      await Sent_package.findOneAndUpdate({ _id: req.params.id }, { rejectedId: reject._id }, { new: true, useFindAndModify: false })
      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg ${package.receipt_no} was rejected by ${auth?.name} because ${req.body.rejectReason} ` }]
      await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, { descriptions: new_des, rejectedAt: Date.now() }, { new: true, useFindAndModify: false })
    }
    if (req.params.state === "picked-from-sender") {
      try {
        let agent = await AgentDetails.findOne({ _id: package.senderAgentID })
        if (agent?.hasShelf) {
          await Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: "recieved-warehouse" }, { new: true, useFindAndModify: false })
        }
        let rider = await User.findOne({ _id: sender.rider })
        if (package.senderAgentID._id.toString() === package.receieverAgentID.toString()) {
          await Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: "delivered" }, { new: true, useFindAndModify: false })
          let new_des = [...narration?.descriptions, { time: Date.now(), desc: `Drop off confirmed by ${auth.name} at Philadelphia 4th floor awaiting to be assigned to ${rider?.name} ` }]
          await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, {
            descriptions: new_des
          }, { new: true, useFindAndModify: false })
          const textbody = { address: Format_phone_number(`${package.customerPhoneNumber}`), Body: `Hi ${package.customerName}\nYour Package with reciept No ${package.receipt_no} has been  delivered at ${package?.senderAgentID?.business_name} ready for collection  ` }
          await SendMessage(textbody)
          return res
            .status(200)
            .json({ success: true, message: "Package sent to  successful" });
        }

        if (agent?.hasShelf) {

          await Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: "recieved-warehouse" }, { new: true, useFindAndModify: false })
          await new Narations({ package: req.params.id, state: req.params.state, descriptions: `Package dropped to agent ${package.senderAgentID.business_name})` }).save()
          let new_description = [...narration.descriptions, { time: Date.now(), desc: `Pkg ${package.receipt_no}  dropped at Phildelphia sorting area` }]
          await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, {
            warehouse:
            {
              warehouseAt: moment(),

            },
            descriptions: new_description
          }, { new: true, useFindAndModify: false })


          const textbody = { address: Format_phone_number(`${package.customerPhoneNumber}`), Body: `Hi ${package.customerName}\nYour Package with reciept No ${package.receipt_no} has been  dropped at ${package?.senderAgentID?.business_name} and will be shipped to in 24hrs ` }
          await SendMessage(textbody)
          await new Narations({ package: req.params.id, state: req.params.state, descriptions: `Package dropped to agent(${package.receieverAgentID.business_name})` }).save()
          let payments = getRandomNumberBetween(100, 200)
          await new Commision({ agent: req.user._id, agent_package: req.params.id, commision: 0.1 * parseInt(payments) }).save()

        } else {
          await new Narations({ package: req.params.id, state: req.params.state, descriptions: `Package dropped to agent ${package.senderAgentID.business_name})` }).save()
          let new_description = [...narration.descriptions, {
            time: Date.now(), desc: `Drop off confimed  by ${auth?.name} at  ${sender.business_name} waiting for rider to collect`
          }]


          const textbody = { address: Format_phone_number(`${package.customerPhoneNumber}`), Body: `Hi ${package.customerName}\nYour Package with reciept No ${package.receipt_no} has been  dropped at ${package?.senderAgentID?.business_name} and will be shipped to in 24hrs ` }
          await SendMessage(textbody)
          await new Narations({ package: req.params.id, state: req.params.state, descriptions: `Package dropped to agent(${package.receieverAgentID.business_name})` }).save()
          let payments = getRandomNumberBetween(100, 200)
          await new Commision({ agent: req.user._id, agent_package: req.params.id, commision: 0.1 * parseInt(payments) }).save()
        }

      } catch (error) {
        console.log(error)
      }
    }
    if (req.params.state === "assigned") {

      let rider = await User.findOne({ _id: sender.rider })

      await Sent_package.findOneAndUpdate({ _id: req.params.id }, { assignedTo: sender.rider }, { new: true, useFindAndModify: false })

      await new Rider_Package({ package: req.params.id, rider: package.assignedTo }).save()
      // assigned  to rider name for delivery to agent
      await Sent_package.findOneAndUpdate({ _id: req.params.id }, { assignedTo: sender?.rider }, { new: true, useFindAndModify: false })
      await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, {
        assigned:
        {
          assignedTo: sender?.rider,
          assignedAt: Date.now(),
          assignedBy: req.user._id,
        },
        // descriptions: new_des
      }, { new: true, useFindAndModify: false })

      // await Rider.findOneAndUpdate({ user: package.assignedTo }, { no_of_packages: parseInt(rider?.no_of_packages + 1) }, { new: true, useFindAndModify: false })
    }
    if (req.params.state === "on-transit") {
      // package dropped at agent and confirmed by name
      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg collected by rider ${rider.name} waiting to be dropped at sorting, Phildelphia Hse` }]

      await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, {
        accepted:
        {
          acceptedBy: package?.assignedTo,
          acceptedAt: moment(),

        },
        descriptions: new_des
      }, { new: true, useFindAndModify: false })

      await new Narations({ package: req.params.id, state: req.params.state, descriptions: `package delivered to agent name(${package.receieverAgentID.business_name})` }).save()
    }
    if (req.params.state === "dropped") {
      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg dropped by rider ${rider.name} at sorting, Phildelphia Hse` }]
      await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, {
        descriptions: new_des
      }, { new: true, useFindAndModify: false })
    }
    if (req.params.state === "recieved-warehouse") {

      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg  recieved at sorting  philadelphia and awaiting to  be assigned to rider going to destination location, ${reciever.business_name} ` }]

      await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, {
        warehouse:
        {
          recievedBy: req.user._id,

          warehouseAt: moment()
        }, descriptions: new_des
      }, { new: true, useFindAndModify: false })

      await new Narations({ package: req.params.id, state: req.params.state, descriptions: `Package dropped to warehouse` }).save()
    }
    if (req.params.state === "assigned-warehouse") {
      await new Narations({ package: req.params.id, state: req.params.state, descriptions: `Package package assigned rider` }).save()
      await new Rider_Package({ package: req.params.id, rider: req.query.rider }).save()
      await Sent_package.findOneAndUpdate({ _id: req.params.id }, { assignedTo: req.query.rider }, { new: true, useFindAndModify: false })
      let newrider = await User.findById(req.query.rider)
      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg  assigned  by philadelphia sorting to ${newrider.name} heading to ${reciever.business_name}` }]
      let v = await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, {
        reAssigned:
        {
          reAssignedTo: req.query.rider,
          reAssignedAt: Date.now(),
          reAssignedBy: req.user._id,
        }, descriptions: new_des
      }, { new: true, useFindAndModify: false })
      console.log(v.reAssigned)
      await Sent_package.findOneAndUpdate({ _id: req.params.id }, { assignedTo: req.query.rider }, { new: true, useFindAndModify: false })
      // await Rider.findOneAndUpdate({ user: package.assignedTo }, { no_of_packages: parseInt(rider.no_of_packages + 1) }, { new: true, useFindAndModify: false })
    }
    if (req.params.state === "warehouse-transit") {
      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg  accepted by ${recRider.name}  waiting drop off to destination location, ${reciever.business_name} ` }]
      await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, {
        descriptions: new_des
      }, { new: true, useFindAndModify: false })

      await new Narations({ package: req.params.id, state: req.params.state, descriptions: `Package dropped to warehouse` }).save()
    }
    if (req.params.state === "dropped-to-agent") {
      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg delivered by ${recRider.name} at destination agent, ${reciever.business_name}` }]
      await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, {
        droppedToagent:
        {
          droppedToagentBy: package?.assignedTo,
          recievedAt: moment(),
          droppedToagent: package?.receieverAgentID
        },
        descriptions: new_des
      }, { new: true, useFindAndModify: false })

      // await new Narations({ package: req.params.id, state: req.params.state, descriptions: `package delivered to agent name(${package.receieverAgentID.business_name})` }).save()
    }
    if (req.params.state === "delivered") {
      // packge deliverd to agent  by rider
      let new_des = [...narration?.descriptions, { time: Date.now(), desc: `Agent ${auth.name}  confirms arrival of package at the destination agent, ${reciever.business_name}` }]

      await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, {
        descriptions: new_des
      }, { new: true, useFindAndModify: false })
      const textbody = { address: Format_phone_number(`${package.customerPhoneNumber}`), Body: `Hi ${package.customerName}\nYour Package with reciept No ${package.receipt_no} has been  delivered at ${package?.senderAgentID?.business_name} and will be shipped to you in 2hrs ` }
      await SendMessage(textbody)
    }
    if (req.params.state === "collected") {

      try {
        req.body.package = req.params.id
        req.body.dispatchedBy = req.user._id
        req.body.type = "agent"

        let collector = await new Collected(req.body).save()
        // servedById
        await Sent_package.findOneAndUpdate({ package: req.params.id }, { servedById: collector._id }, { new: true, useFindAndModify: false })
        let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg given out to ${collector.collector_name} of ID no ${collector.collector_national_id} phone No 0${collector.collector_phone_number.substring(1, 4)}xxx xxxx   ` }]

        await Track_agent_packages.findOneAndUpdate({ package: req.params.id }, {
          collected: {
            collectedby: collector._id,
            collectedAt: moment(),
            dispatchedBy: req.user._id
          },
          descriptions: new_des
        }, { new: true, useFindAndModify: false })
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

    var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
    let agent_packages

    if (req.query.searchKey) {
      agent_packages = await Sent_package.find({ payment_status: "paid", state: req.params.state, assignedTo: req.user._id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] }).sort({ createdAt: -1 }).limit(100)
        .populate('createdBy', 'f_name l_name name')
        .populate('receieverAgentID', 'business_name')
        .populate('senderAgentID', 'business_name')
        .populate('businessId')
        .populate('servedById')
      return res
        .status(200)
        .json(agent_packages);
    } else {
      agent_packages = await Sent_package.find({ payment_status: "paid", state: req.params.state, assignedTo: req.user._id }).sort({ createdAt: -1 }).limit(100)
        .populate('createdBy', 'f_name l_name name')
        .populate('receieverAgentID', 'business_name')
        .populate('senderAgentID', 'business_name')
        .populate('businessId')
        .populate('servedById')
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
router.get("/agents-wh-droped-package", [authMiddleware, authorized], async (req, res) => {

  try {
    // let agent = await AgentUser.findOne({ user: req.user._id })
    const { rider, agent } = req.query

    let agent_packages


    agent_packages = await Sent_package.find({ payment_status: "paid", state: "dropped", assignedTo: rider, senderAgentID: agent }).sort({ createdAt: -1 }).limit(100)
      .populate('createdBy', 'f_name l_name name')
      .populate('receieverAgentID', 'business_name')
      .populate('senderAgentID', 'business_name')
      .populate('businessId')
      .populate('assignedTo')

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


router.get("/agents-rider-packages", [authMiddleware, authorized], async (req, res) => {
  try {

    let { state } = req.query
    let packages = await Sent_package.find({ assignedTo: req.user._id, type: "agent", state: state })
    let agents_count = {}

    for (let i = 0; i < packages.length; i++) {

      agents_count[packages[i].senderAgentID.toString()] = agents_count[packages[i].senderAgentID.toString()] ? [...agents_count[packages[i].senderAgentID.toString()], packages[i]._id] : [packages[i]._id]

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
router.put("/wh-agent-pick-package/:id/:state", [authMiddleware, authorized], async (req, res) => {
  try {
    console.log(req.params)

    let packages = await Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state }, { new: true, useFindAndModify: false })

    return res.status(200)
      .json(packages);

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

router.put("/wh-agentassign-package/:id/:state", [authMiddleware, authorized], async (req, res) => {
  try {


    let { rider } = req.query
    let packages = await Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state, assignedTo: rider }, { new: true, useFindAndModify: false })

    return res.status(200)
      .json(packages);

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/reciever-agents-rider-packages", [authMiddleware, authorized], async (req, res) => {
  try {

    let { state } = req.query
    // console.log()
    let packages = await Sent_package.find({ assignedTo: req.user._id, state: state })

    let agents_count = {}

    for (let i = 0; i < packages.length; i++) {

      agents_count[packages[i].receieverAgentID.toString()] = agents_count[packages[i].receieverAgentID.toString()] ? [...agents_count[packages[i].receieverAgentID.toString()], packages[i]._id] : [packages[i]._id]

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
router.get("/agents-wh-recieved-warehouse-package", [authMiddleware, authorized], async (req, res) => {

  try {
    // let agent = await AgentUser.findOne({ user: req.user._id })
    const { rider, agent } = req.query

    let packages

    packages = await Sent_package.find({ payment_status: "paid", state: "recieved-warehouse", assignedTo: rider, receieverAgentID: agent }).sort({ createdAt: -1 }).limit(100)
      .populate('createdBy', 'f_name l_name name')
      .populate('receieverAgentID', 'business_name')
      .populate('senderAgentID', 'business_name')
      .populate('businessId')
      .populate('assignedTo')

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
// count packages assigned by a rider
router.get("/agents-rider-package-count", [authMiddleware, authorized], async (req, res) => {

  try {


    let OnTransit = await Sent_package.find({ payment_status: "paid", state: "on-transit", assignedTo: req.user._id })

    let assigned = await Sent_package.find({ payment_status: "paid", state: "assigned", assignedTo: req.user._id })
    let warehouseTransit = await Sent_package.find({ payment_status: "paid", state: "warehouse-transit", assignedTo: req.user._id })
    let assignedWarehouse = await Sent_package.find({ payment_status: "paid", state: "assigned-warehouse", assignedTo: req.user._id })


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
router.get("/agent-agent-rejected-packages", [authMiddleware, authorized], async (req, res) => {
  try {
    let agent_packages
    let { id } = req.query
    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      agent_packages = await Sent_package.find({ businessId: id, state: "rejected", createdBy: req.user._id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] }).sort({ createdAt: -1 }).limit(100)
        // .populate('location')
        .populate('businessId')
        .populate('createdBy')
        .populate("rejectedId")
      return res.status(200)
        .json(agent_packages);
    } else {
      agent_packages = await Sent_package.find({ businessId: id, state: "rejected", createdBy: req.user._id, }).sort({ createdAt: -1 }).limit(100)
        // .populate('location')
        .populate('businessId')
        .populate('createdBy')
        .populate("rejectedId")
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
router.get("/agent-agent-package-expired", [authMiddleware, authorized], async (req, res) => {
  try {
    let { id } = req.query
    let agent_packages
    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      agent_packages = await Sent_package.find({ businessId: id, updatedAt: { $lte: moment().subtract(4, 'days').toDate() }, state: { $ne: "collected" }, createdBy: req.user._id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] }).sort({ createdAt: -1 }).limit(100)
        // .populate('location')
        .populate('businessId')
        .populate('createdBy')

      return res.status(200)
        .json(agent_packages);
    } else {
      agent_packages = await Sent_package.find({ businessId: id, updatedAt: { $lte: moment().subtract(4, 'days').toDate() }, state: { $ne: "collected" }, createdBy: req.user._id, }).sort({ createdAt: -1 }).limit(100)
        // .populate('location')
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

router.get("/agent/switchboard-search", [authMiddleware, authorized], async (req, res) => {
  try {
    var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
    let agent_packages = await Track_agent_packages.find({ reciept: searchKey }).sort({ createdAt: -1 }).limit(100).populate({
      path: 'package', populate: {
        path: 'receieverAgentID'
      }
    })
      .populate({
        path: 'package', populate: {
          path: 'createdBy',
        }
      })
      .populate({
        path: 'package',
        populate: {
          path: 'senderAgentID',
          populate: {
            path: 'location_id'
          }
        }
      })
      .populate({
        path: 'package', populate: {
          path: 'assignedTo'
        }
      })
      // .populate("collectedBy")
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
      .json(agent_packages);

    return res.status(200)
      .json(agent_packages);

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/agent-search/:state", [authMiddleware, authorized], async (req, res) => {

  try {

    var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
    let agent_packages
    let { id } = req.query
    agent_packages = await Sent_package.find({ state: req.params.state, $or: [{ senderAgentID: id }, { receieverAgentID: id }], $or: [{ packageName: searchKey }, { receipt_no: searchKey }] }).sort({ createdAt: -1 }).limit(100)
      .populate('createdBy', 'f_name l_name name')
      .populate('receieverAgentID', 'business_name')
      .populate('senderAgentID', 'business_name')
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

// router.get("/rented-agents-packages", [authMiddleware, authorized], async (req, res) => {
//   try {
//     let { state } = req.query

//     let agent_packages
//     agent_packages = await Sent_package.find({ payment_status: "paid", state: state })
// .sort({ createdAt: -1 }).limit(100)
//       .populate('createdBy', 'f_name l_name name')
//       .populate('receieverAgentID', 'business_name')
//       .populate('senderAgentID', 'business_name')
//       .populate('businessId')

//     return res
//       .status(200)
//       .json(agent_packages);

//   } catch (error) {
//     console.log(error);
//     return res
//       .status(400)
//       .json({ success: false, message: "operation failed ", error });
//   }
// });


router.get("/shelf-request-packages", [authMiddleware, authorized], async (req, res) => {
  try {

    let { state, id } = req.query

    let packages = await Sent_package.find({ payment_status: "paid", state: state, senderAgentID: id })

    let agents_count = {}

    for (let i = 0; i < packages.length; i++) {
      let package = await Sent_package.findOne({ _id: [packages[i]._id] }).populate('businessId')
      agents_count[packages[i]?.businessId?.toString()] = agents_count[packages[i]?.businessId?.toString()] ?
        { packages: [...agents_count[packages[i]?.businessId?.toString()]?.packages, packages[i]._id], name: package.businessId.name }
        : { packages: [packages[i]._id], name: package.businessId.name }
      //   agents_count[packages[i].businessId.toString()] = agents_count[packages[i].businessId.toString()] ?
      //     [...agents_count[packages[i].businessId.toString()], { packages: [packages[i]._id], name: package.businessId.name }] 
      // : { packages: [packages[i]._id], name: package.businessId.name }
      // 
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
router.get("/shelf-request-packages/:id", [authMiddleware, authorized], async (req, res) => {
  try {

    let { state, id } = req.query

    let packages = await Sent_package.find({ payment_status: "paid", state: state, businessId: req.params.id, senderAgentID: id })
      .sort({ createdAt: -1 }).limit(100)
      .populate('createdBy', 'f_name l_name name')
      .populate('receieverAgentID', 'business_name')
      .populate('senderAgentID', 'business_name')
      .populate('businessId')


    return res.status(200)
      .json(packages);

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});



router.get("/agent-package-track/:id", [authMiddleware, authorized], async (req, res) => {
  try {

    let narations = await Track_agent_packages.find({ package: req.params.id }).sort({ createdAt: -1 })
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
// Fetch packages assigned to one rider
router.get("/rider-packages/:state", [authMiddleware, authorized], async (req, res) => {
  try {

    let packages = await Sent_package.find({ assignedTo: req.user._id, state: req.params.state, type: "agent", })
      // .populate('createdBy', 'f_name l_name name phone_number')
      // .populate('receieverAgentID')
      // .populate('senderAgentID')
      // .populate("businessId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ packages, "count": packages.length });

  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
// router.get("/agents-rider-packages", [authMiddleware, authorized], async (req, res) => {
//   try {
//     let agents = []

//     let { state } = req.query

//     let packages = await Sent_package.find({ assignedTo: req.user._id, type: "agent", state: state })
//     let agents_count = {}

//     for (let i = 0; i < packages.length; i++) {

//       agents_count[packages[i].senderAgentID.toString()] = agents_count[packages[i].senderAgentID.toString()] ? [...agents_count[packages[i].senderAgentID.toString()], packages[i]._id] : [packages[i]._id]

//     }

//     return res.status(200)
//       .json(agents_count);

//   } catch (error) {
//     console.log(error);
//     return res
//       .status(400)
//       .json({ success: false, message: "operation failed ", error });
//   }
// });
router.get("/agent-packages", [authMiddleware, authorized], async (req, res) => {
  try {

    const { state, id } = req.query


    let packages
    if (state === "rejected") {
      packages = await Sent_package.find({ payment_status: "paid", senderAgentID: id, state: state, })
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
      packages = await Sent_package.find({ payment_status: "paid", senderAgentID: id, state: state, })
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
      console.log(packages)
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });
    }
    if (state === "delivered") {
      packages = await Sent_package.find({ payment_status: "paid", $or: [{ receieverAgentID: id },], state: state, })
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
    else {
      packages = await Sent_package.find({ senderAgentID: id, state: state })
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
router.post("/Mpesa-till", [authMiddleware, authorized], async (req, res) => {
  const result = await Mpesa_stk("0716017221", 1)
  return res.status(200).json({ success: true, message: `Result: ${JSON.stringify(result)}` });

})
router.get("/agent-packages/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    const { state } = req.query
    console.log(state)
    console.log(req.params.id)
    let packages = await Sent_package.find({ senderAgentID: req.params.id, state: state, })
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
  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/receiever-agent-packages/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    const { state } = req.query
    let packages = await Sent_package.find({ receieverAgentID: req.params.id, state: state, })
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
  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.post("/rent-shelf-to-agent/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: req.params.id }, { pipe: "doorStep" }, { new: true, useFindAndModify: false })
    const { body } = req.body;
    let agent_id = await AgentDetails.findOne({ _id: packages[i].agent })
    let newPackageCount = 1
    if (agent_id.package_count) {
      newPackageCount = parseInt(agent_id?.package_count + 1)
    }
    let route = await RiderRoutes.findOne({ agent: agent_id._id })

    body.createdBy = req.user._id
    body.origin = { lng: null, lat: null, name: '' }
    body.destination = {
      name: body?.destination?.name,
      lat: body?.destination?.latitude,
      lng: body?.destination?.longitude
    }
    body.receipt_no = `${agent_id.prefix}${newPackageCount}`;
    body.assignedTo = route.rider
    body.state = "pending-doorstep"

    let customer = await Customer.findOne({ seller: req.user._id, customer_phone_number: body.customerPhoneNumber })
    if (customer === null) {
      await new Customer({ door_step_package_count: 1, total_package_count: 1, seller: req.user._id, customer_name: body.customerName, customer_phone_number: body.customerPhoneNumber }).save()
    }
    else {
      await Customer.findOneAndUpdate({ seller: req.user._id, }, { door_step_package_count: parseInt(customer.door_step_package_count + 1) }, { new: true, useFindAndModify: false })
    }
    newpackage = await new Door_step_Sent_package(body).save();
    await AgentDetails.findOneAndUpdate({ _id: body.agent }, { package_count: newPackageCount }, { new: true, useFindAndModify: false })
    if (req.body.payment_option === "vendor") {
      await Mpesa_stk(req.body.payment_phone_number, req.body.total_payment_amount, req.user._id, "doorstep")
    }
    else {
      await Door_step_Sent_package.findOneAndUpdate({ _id: newpackage._id }, { payment_status: "to-be-paid" }, { new: true, useFindAndModify: false })

    }

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

router.get("/agent-packages-count", [authMiddleware, authorized], async (req, res) => {
  try {


    const { period, state, id } = req.query
    let packages

    if (period === 0 || period === undefined || period === null) {
      let dropped = await Sent_package.find({ payment_status: "paid", senderAgentID: id, state: "dropped" })
      let assigneWarehouse = await Sent_package.find({ payment_status: "paid", senderAgentID: id, state: "assigned-warehouse" })
      let warehouseTransit = await Sent_package.find({ payment_status: "paid", senderAgentID: id, state: "warehouse-transit" })
      let unavailable = await Sent_package.find({ payment_status: "paid", senderAgentID: id, state: "unavailable" })
      let picked = await Sent_package.find({ payment_status: "paid", senderAgentID: id, state: "picked" })
      let request = await Sent_package.find({ payment_status: "paid", senderAgentID: id, state: "request" })
      let delivered = await Sent_package.find({ payment_status: "paid", receieverAgentID: id, state: "delivered" })
      let collected = await Sent_package.find({ payment_status: "paid", receieverAgentID: id, state: "collected" })
      let rejected = await Sent_package.find({ payment_status: "paid", receieverAgentID: id, state: "rejected" })
      let onTransit = await Sent_package.find({ payment_status: "paid", receieverAgentID: id, state: "on-transit" })
      let cancelled = await Sent_package.find({ payment_status: "paid", senderAgentID: id, state: "cancelled" })
      let droppedToagent = await Sent_package.find({ payment_status: "paid", receieverAgentID: id, state: "dropped-to-agent" })
      let assigned = await Sent_package.find({ payment_status: "paid", senderAgentID: id, state: "assigned" })
      let recievedWarehouse = await Sent_package.find({ payment_status: "paid", senderAgentID: id, state: "recieved-warehouse" })
      let pickedfromSender = await Sent_package.find({ payment_status: "paid", senderAgentID: id, state: "picked-from-sender" })

      return res.status(200)
        .json({ message: "Fetched Sucessfully after", pickedfromSender: pickedfromSender.length, cancelled: cancelled.length, droppedToagent: droppedToagent.length, assigned: assigned.length, recievedWarehouse: recievedWarehouse.length, dropped: dropped.length, assigneWarehouse: assigneWarehouse.length, warehouseTransit: warehouseTransit.length, unavailable: unavailable.length, picked: picked.length, request: request.length, delivered: delivered.length, collected: collected.length, rejected: rejected.length, onTransit: onTransit.length });
    }

    else if (period === 0 || period === undefined || period === null && req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      let dropped = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "dropped" })
      let assigneWarehouse = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "assigned-warehouse" })
      let warehouseTransit = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "warehouse-transit" })
      let unavailable = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "unavailable" })
      let picked = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "picked" })
      let request = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "request" })
      let delivered = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "delivered" })
      let collected = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "collected" })
      let rejected = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "rejected" })
      let onTransit = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "on-transit" })
      let cancelled = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "cancelled" })
      let droppedToagent = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "dropped-to-agent" })
      let assigned = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "assigned" })
      let recievedWarehouse = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "recieved-warehouse" })
      let pickedfromSender = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "picked-from-sender" })
      return res.status(200)
        .json({ message: "Fetched Sucessfully after", pickedfromSender: pickedfromSender.length, cancelled: cancelled.length, droppedToagent: droppedToagent.length, assigned: assigned.length, recievedWarehouse: recievedWarehouse.length, dropped: dropped.length, assigneWarehouse: assigneWarehouse.length, warehouseTransit: warehouseTransit.length, unavailable: unavailable.length, picked: picked.length, request: request.length, delivered: delivered.length, collected: collected.length, rejected: rejected.length, onTransit: onTransit.length });
    }

    else if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ payment_status: "paid", agent: id, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
      let dropped = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], state: "dropped" })
      let assigneWarehouse = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "assigned-warehouse" })
      let warehouseTransit = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "warehouse-transit" })
      let unavailable = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "unavailable" })
      let picked = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "picked" })
      let request = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "request" })
      let delivered = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "delivered" })
      let collected = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "collected" })
      let rejected = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "rejected" })
      let onTransit = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "on-transit" })
      let cancelled = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "cancelled" })
      let droppedToagent = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "dropped-to-agent" })
      let assigned = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "assigned" })
      let recievedWarehouse = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "recieved-warehouse" })
      let pickedfromSender = await Sent_package.find({ payment_status: "paid", senderAgentID: id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }], updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "picked-from-sender" })
      return res.status(200)
        .json({ message: "Fetched Sucessfully after", pickedfromSender: pickedfromSender.length, cancelled: cancelled.length, droppedToagent: droppedToagent.length, assigned: assigned.length, recievedWarehouse: recievedWarehouse.length, dropped: dropped.length, assigneWarehouse: assigneWarehouse.length, warehouseTransit: warehouseTransit.length, unavailable: unavailable.length, picked: picked.length, request: request.length, delivered: delivered.length, collected: collected.length, rejected: rejected.length, onTransit: onTransit.length });
    }


    else {
      packages = await Sent_package.find({ agent: id, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() } })
      let dropped = await Sent_package.find({ agent: id, state: "dropped" })
      let assigneWarehouse = await Sent_package.find({ agent: id, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "assigned-warehouse" })
      let warehouseTransit = await Sent_package.find({ agent: id, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "warehouse-transit" })
      let unavailable = await Sent_package.find({ agent: id, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "unavailable" })
      let picked = await Sent_package.find({ agent: id, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "picked" })
      let request = await Sent_package.find({ agent: id, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "request" })
      let delivered = await Sent_package.find({ agent: id, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "delivered" })
      let collected = await Sent_package.find({ agent: id, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "collected" })
      let rejected = await Sent_package.find({ agent: id, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "rejected" })
      let onTransit = await Sent_package.find({ agent: id, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "on-transit" })
      let cancelled = await Sent_package.find({ agent: id, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "cancelled" })
      let droppedToagent = await Sent_package.find({ agent: id, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "dropped-to-agent" })
      let assigned = await Sent_package.find({ agent: id, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "assigned" })
      let recievedWarehouse = await Sent_package.find({ agent: id, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "recieved-warehouse" })
      let pickedfromSender = await Sent_package.find({ agent: id, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, state: "picked-from-sender" })
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

      .populate('createdBy', 'f_name l_name name')
      .populate('receieverAgentID', 'business_name')
      .populate('senderAgentID', 'business_name')
      .populate('assignedTo', 'name')
      .populate('businessId').sort({ createdAt: -1 });
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
router.get("/agent-packages-web-recieved-warehouse", async (req, res) => {
  try {
    let packages
    packages = await Sent_package.find({ state: "recieved-warehouse" })
      .populate('createdBy', 'f_name l_name name phone_number')
      .populate('receieverAgentID')

      .populate('senderAgentID')
      .populate("businessId", "name")
    return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/reciever-agent-packages", [authMiddleware, authorized], async (req, res) => {

  try {


    const { period, state, id } = req.query

    let packages
    if (period === 0 || period === undefined || period === null) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')

      packages = await Sent_package.find({ payment_status: "paid", receieverAgentID: id, state: state })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID")
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });

    } else if (req.query.searchKey) {

      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ payment_status: "paid", receieverAgentID: id, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID")
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });

    }
    else if (state && req.query.searchKey) {

      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      packages = await Sent_package.find({ payment_status: "paid", receieverAgentID: id, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() }, $or: [{ packageName: searchKey }, { receipt_no: searchKey }] })
        .populate("createdBy", "l_name f_name phone_number")
        .populate("senderAgentID",)
        .populate("receieverAgentID")
        .populate("businessId", "name")
        .sort({ createdAt: -1 });
      return res.status(200).json({ message: "Fetched Sucessfully", packages, "count": packages.length });
    }
    else {

      packages = await Sent_package.find({ payment_status: "paid", receieverAgentID: id, state: state, updatedAt: { $gte: moment().subtract(period, 'days').toDate() } })
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
      // .populate('agent_package')
      .populate({
        path: 'agent_package', populate: {
          path: 'businessId'
        }
      })
      .populate('doorstep_package').populate('rent_shelf')


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
      // .populate("collectedby")
      // .populate("droppedTo")
      return res.status(200)
        .json(packages);
    } else {
      packages = await Track_agent_packages.find().sort({ createdAt: -1 }).limit(100)
        .populate({
          path: 'package', populate: {
            path: 'receieverAgentID'
          }
        })
        .populate({
          path: 'package', populate: {
            path: 'createdBy',
          }
        })
        .populate({
          path: 'package',
          populate: {
            path: 'senderAgentID',
            populate: {
              path: 'location_id'
            }
          }
        })
        .populate({
          path: 'package', populate: {
            path: 'assignedTo'
          }
        })
        // .populate("collectedBy")
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


router.get("/agent/track/packages/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    let packages


    packages = await Track_agent_packages.findOne({ package: req.params.id }).sort({ createdAt: -1 }).limit(100)

      // .populate("collectedby")
      .populate({
        path: 'package', populate: {
          path: 'receieverAgentID'
        }
      })
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
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});


module.exports = router;
