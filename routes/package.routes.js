const express = require("express");
var Rent = require("models/rent_a_shelf_delivery.model");
var Rent_a_shelf_deliveries = require("models/rent_a_shelf_deliveries");
var Agent = require("models/agents.model");
var AgentDetails = require("models/agentAddmin.model");
var RiderRoutes = require("models/rider_routes.model");
var Collected = require("models/collectors.model");
var Customer = require("models/customer.model");
var Unavailable = require("models/unavailable.model");
var DoorstepNarations = require('models/door_step_narations.model');
var rentshelfNarations = require('models/rent_shelf_narations.model');
var Track_rent_a_shelf = require('models/rent_shelf_package_track.model');
var Track_door_step = require('models/door_step_package_track.model');

var Track_agent_packages = require('models/agent_package_track.model');
var Bussiness = require("models/business.model");
var Product = require("models/products.model.js");
var Rider_Package = require('models/rider_package.model')
var Sent_package = require("models/package.modal.js");
var Door_step_Sent_package = require("models/doorStep_delivery_packages.model");
var Reject = require("models/Rejected_parcels.model");
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
  // console.log("REDY", req.body)
  // let v = await Mpesa_stk("0720141534", 1, 1, "doorstep")
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
        let newPackageCount = 1
        if (agent_id.package_count) {
          newPackageCount = parseInt(agent_id?.package_count + 1)
        }
        let route = await RiderRoutes.findOne({ agent: agent_id._id })
        if (packages[i]?.product) {

          const product = await Product.findById(packages[i].product);
          packages[i].packageName = product.product_name;
          packages[i].isProduct = true;
          packages[i].package_value = product.price
          await Product.findOneAndUpdate({ _id: packages[i].product }, { qty: parseInt(product.qty - 1) }, { new: true, useFindAndModify: false })


        }
        if (packages[i].products?.length !== 0) {
          const item = packages[i].products
          let products_name = item?.map(function (item) {
            return `${item.product_name}(${item?.cart_amt})`;
          })
            .join(',')
          let products_price = item?.reduce(function (accumulator, currentValue) {
            const totalPrice =
              parseInt(currentValue.price) *
              parseInt(currentValue?.cart_amt);
            return accumulator + totalPrice;
          }, 0)
          for (let k = 0; k < item.length; k++) {
            const product = await Product.findById(item[k]._id);
            await Product.findOneAndUpdate({ _id: item[k]._id }, { qty: parseInt(product.qty) - parseInt(item[k].cart_amt) }, { new: true, useFindAndModify: false })
          }
          packages[i].packageName = products_name;
          packages[i].isProduct = true;
          packages[i].package_value = products_price;
        }
        packages[i].createdBy = req.user._id
        packages[i].origin = { lng: null, lat: null, name: '' }
        packages[i].destination = {
          name: body?.packages[i]?.destination?.name,
          lat: body?.packages[i]?.destination?.latitude,
          lng: body?.packages[i]?.destination?.longitude
        }
        packages[i].receipt_no = `${agent_id.prefix}${newPackageCount}`;
        packages[i].assignedTo = route.rider

        let customer = await Customer.findOne({ seller: req.user._id, customer_phone_number: packages[i].customerPhoneNumber })
        if (customer === null) {
          await new Customer({ door_step_package_count: 1, total_package_count: 1, seller: req.user._id, customer_name: packages[i].customerName, customer_phone_number: packages[i].customerPhoneNumber }).save()
        }
        else {
          await Customer.findOneAndUpdate({ seller: req.user._id, }, { door_step_package_count: parseInt(customer.door_step_package_count + 1), total_package_count: parseInt(customer.total_package_count + 1) }, { new: true, useFindAndModify: false })
        }
        if (packages[i].pipe === "doorstep") {
          packages[i].state = "pending-doorstep"
          await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: packages[i].p_id }, { state: "doorstep" }, { new: true, useFindAndModify: false })
        }
        newpackage = await new Door_step_Sent_package(packages[i]).save();

        let V = await new Track_door_step({
          package: newpackage._id, created: {
            createdAt: moment(),
            createdBy: req.user._id
          }, state: "request", descriptions: `Package created`, reciept: newpackage.receipt_no
        }).save()
        await AgentDetails.findOneAndUpdate({ _id: packages[i].agent }, { package_count: newPackageCount }, { new: true, useFindAndModify: false })
        // await new DoorstepNarations({ package: newpackage._id, state: "request", descriptions: `Package created` }).save()
        // await new DoorstepNarations({ package: newpackage._id, state: "assigned", descriptions: `Package assigned rider` }).save()
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
        packages[0]
        // if (packages[i].state === "early_collection") {
        //   await new Track_rent_a_shelf({ package: savedPackage._id, created: moment(), state: "early_collection", descriptions: ``, reciept: savedPackage.receipt_no }).save()
        // }
        if (packages[i].product) {
          const product = await Product.findById(packages[i].product);
          packages[i].packageName = product.product_name;
          packages[i].isProduct = true;
          packages[i].package_value = product.price;
          await Product.findOneAndUpdate({ _id: packages[i].product }, { qty: parseInt(product.qty - 1) }, { new: true, useFindAndModify: false })

        }
        if (packages[i].products?.length !== 0) {
          const item = packages[i].products
          let products_name = item?.map(function (item) {
            return `${item.product_name}(${item?.cart_amt})`;
          })
            .join(',')
          let products_price = item?.reduce(function (accumulator, currentValue) {
            const totalPrice =
              parseInt(currentValue.price) *
              parseInt(currentValue?.cart_amt);
            return accumulator + totalPrice;
          }, 0)
          for (let k = 0; k < item.length; k++) {
            const product = await Product.findById(item[k]._id);
            await Product.findOneAndUpdate({ _id: item[k]._id }, { qty: parseInt(product.qty) - parseInt(item[k].cart_amt) }, { new: true, useFindAndModify: false })
          }
          packages[i].packageName = products_name;
          packages[i].isProduct = true;
          packages[i].package_value = products_price;
        }
        packages[i].location = "63575250602a3e763b1305ed";
        packages[i].createdBy = req.user._id;
        packages[i].businessId = req.body.businessId;
        packages[i].receipt_no = `pm-${Makeid(5)}`;
        const savedPackage = await new Rent_a_shelf_deliveries(
          packages[i]
        ).save();
        let customer = await Customer.findOne({ seller: req.user._id, customer_phone_number: packages[i].customerPhoneNumber })
        if (customer === null) {
          await new Customer({ rent_shelf_package_count: 1, seller: req.user._id, customer_name: packages[i].customerName, customer_phone_number: packages[i].customerPhoneNumber, total_package_count: 1 }).save()
        } else {
          await Customer.findOneAndUpdate({ seller: req.user._id, }, { rent_shelf_package_count: parseInt(customer.rent_shelf_package_count + 1), total_package_count: parseInt(customer.total_package_count + 1) }, { new: true, useFindAndModify: false })
        }
        await new Track_rent_a_shelf({ package: savedPackage._id, created: moment(), state: "request", descriptions: `Package created`, reciept: savedPackage.receipt_no }).save()
        if (req.body.payment_option === "collection") {
          await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: savedPackage._id, }, { hasBalance: true }, { new: true, useFindAndModify: false })
        }
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
        let newPackageCount = 1
        if (agent.package_count) {
          newPackageCount = parseInt(agent?.package_count + 1)
        }

        let route = await RiderRoutes.findOne({ agent: agent._id })

        if (packages[i].product) {
          const product = await Product.findById(packages[i].product);
          packages[i].packageName = product.product_name;
          packages[i].isProduct = true;
          packages[i].package_value = product.price;
          let p = await Product.findOneAndUpdate({ _id: packages[i].product }, { qty: parseInt(product.qty - 1) }, { new: true, useFindAndModify: false })
        }
        packages[i].createdBy = req.user._id
        packages[i].receipt_no = `${agent.prefix ? agent.prefix : "PMT-"}${newPackageCount}`;
        if (!route) {
          return res
            .status(400)
            .json({ message: "The sender agent has no rider kindly select a different agent " });
        }
        packages[i].assignedTo = route.rider

        if (packages[i].products?.length !== 0) {
          const item = packages[i].products
          let products_name = item?.map(function (item) {
            return `${item.product_name}(${item?.cart_amt})`;
          })
            .join(',')
          let products_price = item?.reduce(function (accumulator, currentValue) {
            const totalPrice =
              parseInt(currentValue.price) *
              parseInt(currentValue?.cart_amt);
            return accumulator + totalPrice;
          }, 0)
          for (let k = 0; k < item.length; k++) {
            const product = await Product.findById(item[k]._id);
            await Product.findOneAndUpdate({ _id: item[k]._id }, { qty: parseInt(product.qty) - parseInt(item[k].cart_amt) }, { new: true, useFindAndModify: false })
          }
          packages[i].packageName = products_name;
          packages[i].isProduct = true;
          packages[i].package_value = products_price;

        }
        if (packages[i].pipe === "agent") {
          packages[i].state = "pending-agent"
          let G = await Rent_a_shelf_deliveries.findById(packages[i].p_id)
          await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: packages[i].p_id }, { state: "agent" }, { new: true, useFindAndModify: false })
        }

        let newpackage = await new Sent_package(packages[i]).save();
        packages[i].assignedTo = route.rider
        let customer = await Customer.findOne({ seller: req.user._id, customer_phone_number: packages[i].customerPhoneNumber })
        if (customer === null) {
          await new Customer({ seller: req.user._id, customer_name: packages[i].customerName, customer_phone_number: packages[i].customerPhoneNumber, total_package_count: 1, agent_package_count: 1 }).save()
        }
        else {
          await Customer.findOneAndUpdate({ seller: req.user._id, }, { agent_package_count: parseInt(customer.agent_package_count + 1), total_package_count: parseInt(customer.total_package_count + 1) }, { new: true, useFindAndModify: false })
        }
        await AgentDetails.findOneAndUpdate({ _id: packages[i].senderAgentID }, { package_count: newPackageCount }, { new: true, useFindAndModify: false })
        // await new Narations({ package: newpackage._id, state: "request", descriptions: `Package created` }).save()
        await new Track_agent_packages({
          package: newpackage._id, created: {
            createdAt: moment(),
            createdBy: req.user._id
          }, state: "request", descriptions: `Package created`, reciept: newpackage.receipt_no
        }).save()
        if (req.body.payment_option === "collection") {
          await Mpesa_stk(req.body.payment_phone_number, req.body.total_payment_amount, req.user._id, "agent", packages)
          await Sent_package.findOneAndUpdate({ _id: newpackage._id }, { hasBalance: true }, { new: true, useFindAndModify: false })
        }
      }
      if (req.body.payment_option === "vendor") {

        await Mpesa_stk(req.body.payment_phone_number, req.body.total_payment_amount, req.user._id, "agent", packages)
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
    if (req.params.state === "collected" && package.booked === true) {
      let collector = await Collected.findOneAndUpdate({ package: req.params.id }, {
        collector_signature: req.body.collector_signature
      }, { new: true, useFindAndModify: false })
      await Track_rent_a_shelf.findOneAndUpdate({ package: req.params.id }, { collectedby: collector._id, collectedAt: Date.now() }, { new: true, useFindAndModify: false })

    }
    if (req.params.state === "collected" && package.booked === true) {
      req.body.package = req.params.id
      req.body.dispatchedBy = req.user._id
      let collector = await new Collected(req.body).save()
      await Track_rent_a_shelf.findOneAndUpdate({ package: req.params.id }, { collectedby: collector._id, collectedAt: Date.now() }, { new: true, useFindAndModify: false })

    }
    if (req.params.state === "early_collection") {
      req.body.package = req.params.id
      req.body.dispatchedBy = req.user._id
      await new Collected(req.body).save()
      await Track_rent_a_shelf.findOneAndUpdate({ package: req.params.id }, {
        booked: {
          bookedBy: req.user._id,
          bookedAt: moment(),
          bookedFor: req.body.time
        }
      }, { new: true, useFindAndModify: false })
      await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: req.params.id }, { booked: true }, { new: true, useFindAndModify: false })
      return res.status(200).json({ message: "Sucessfully" });
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
      agent_packages = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: req.params.state, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] }).sort({ createdAt: -1 }).limit(100)
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
      // .populate("collectedby")
      // .populate("droppedTo")
      return res.status(200)
        .json(packages);
    } else {
      packages = await Track_rent_a_shelf.find().sort({ createdAt: -1 }).limit(100)
        .populate({
          path: 'package',
          populate: {
            path: 'location',
          }
        })
        // .populate("collectedby")
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
router.get("/rent-shelf/track/packages/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    let packages
    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      tra = await Track_rent_a_shelf.findOne({ package: req.params.id, $or: [{ reciept: searchKey }] }).sort({ createdAt: -1 }).limit(100)
        .populate('package')
      // .populate("collectedby")
      // .populate("droppedTo")
      return res.status(200)
        .json(packages);
    } else {
      packages = await Track_rent_a_shelf.findOne({ package: req.params.id }).sort({ createdAt: -1 }).limit(100)
        .populate('package')
        // .populate("collectedby")
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
  const agentDetaoils = await AgentDetails.findOne({ user: req.user._id });


  try {
    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      let dropped = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "picked-from-seller", $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
      let unavailable = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "unavailable", $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
      let picked = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "picked", $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
      let request = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "request", $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
      let collected = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "collected", $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
      let rejected = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "rejected", $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
      let droppedToagent = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "dropped-to-agent", $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
      let assigned = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "assigned", $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
      let pickedfromSender = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: "picked-from-seller", $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
      return res.status(200)
        .json({ message: "Fetched Sucessfully after", pickedfromSender: pickedfromSender.length, cancelled: cancelled.length, droppedToagent: droppedToagent.length, assigned: assigned.length, dropped: dropped.length, assigneWarehouse: assigneWarehouse.length, warehouseTransit: warehouseTransit.length, unavailable: unavailable.length, picked: picked.length, request: request.length, delivered: delivered.length, collected: collected.length, rejected: rejected.length, onTransit: onTransit.length });
    } else {
      let dropped = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "picked-from-seller" })
      let unavailable = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "unavailable" })
      let picked = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "picked" })
      let request = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "request" })
      let collected = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "collected" })
      let rejected = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "rejected" })
      let onTransit = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "on-transit" })
      let cancelled = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "cancelled" })
      let droppedToagent = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "dropped-to-agent" })
      let assigned = await Rent_a_shelf_deliveries.find({ location: agent?.agent, state: "assigned" })
      let agentOrderRequest = await Sent_package.find({ payment_status: "paid", state: "pending-agent", $or: [{ packageName: searchKey }, { receipt_no: searchKey }] }).sort({ createdAt: -1 }).limit(100)
      let earlyOrderRequest = await Rent_a_shelf_deliveries.find({ location: agent?.agent, $or: [{ state: "early_collection" }] })
      let doorSteporderRequest = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], state: "pending-doorstep" }).sort({ createdAt: -1 }).limit(100).populate('createdBy', 'f_name l_name name phone_number').populate('businessId').populate('agent');
      let pickedfromSender = await Rent_a_shelf_deliveries.find({ location: agent?.agent, $or: [{ state: "picked-from-seller" }] })
      let incomingStock = await Product.find({
        pending_stock: {
          $gt: 0
        }
      })
      return res.status(200)
        .json({ message: "Fetched Sucessfully after", earlyOrderRequest: earlyOrderRequest.length, doorSteporderRequest: doorSteporderRequest.length, agentOrderRequest: agentOrderRequest.length, incomingStock: incomingStock.length, pickedfromSender: pickedfromSender.length, cancelled: cancelled.length, droppedToagent: droppedToagent.length, assigned: assigned.length, dropped: dropped.length, unavailable: unavailable.length, picked: picked.length, request: request.length, collected: collected.length, rejected: rejected.length, onTransit: onTransit.length });
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
router.get("/user-agent-agent-package/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
    let agent_packages = await Sent_package.find({ createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
      .sort({ createdAt: -1 })
      .populate("senderAgentID")
      .populate("receieverAgentID")
      // .populate("agent")
      .limit(100);
    return res.status(200)
      .json(agent_packages)
  } catch (error) {

  }

})
router.get("/user-door-step-package/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
    let packages = await Door_step_Sent_package.findOne({ state: "picked-from-sender", createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
      .populate(
        "customerPhoneNumber packageName package_value package_value packageName customerName"
      )
      // .populate("agent")
      .sort({ createdAt: -1 })
      .limit(100);
    return res.status(200)
      .json(packages)
  } catch (error) {
    console.log(error)
  }

})
router.get("/user-rent_shelf-package/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
    let packages = await Rent_a_shelf_deliveries.findOne({ $or: [{ state: "picked-from-sender" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
      .sort({ createdAt: -1 })
      .limit(100);
    return res.status(200)
      .json(packages)
  } catch (error) {

  }

})
router.get("/user-packages/:id", [authMiddleware, authorized], async (req, res) => {

  try {
    let agent_packages = {}
    let doorstep_packages = {}
    let shelves = {}
    // "request", "delivered", "collected", "cancelled", "rejected", "on-transit", "dropped-to-agent", 'collected', "assigned", "recieved-warehouse", "picked", "picked-from-sender", "unavailable", "dropped", "", "warehouse-transit"
    if (req.query.searchKey) {
      var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
      agent_packages.created = await Sent_package.findOne({ state: "request", createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);
      agent_packages.dropped = await Sent_package.findOne({ state: "picked-from-sender", createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);
      agent_packages.transit = await Sent_package.findOne({ $or: [{ state: "on-transit" }, { state: "warehouse-transit" }, { state: "assigned" }, { state: "dropped" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);
      agent_packages.warehouse = await Sent_package.findOne({ $or: [{ state: "recieved-warehouse" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);

      agent_packages.delivered = await Sent_package.findOne({ $or: [{ state: "dropped-to-agent" }, { state: "delivered" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);
      agent_packages.collected = await Sent_package.findOne({ $or: [{ state: "collected" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .sort({ createdAt: -1 })
        .populate("senderAgentID")
        .populate("receieverAgentID")
        // .populate("agent")
        .limit(100);

      doorstep_packages.created = await Door_step_Sent_package.find({ state: "request", createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);
      doorstep_packages.dropped = await Door_step_Sent_package.findOne({ state: "picked-from-sender", createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);
      doorstep_packages.transit = await Door_step_Sent_package.findOne({ $or: [{ state: "on-transit" }, { state: "warehouse-transit" }, { state: "assigned" }, { state: "dropped" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);
      doorstep_packages.warehouse = await Door_step_Sent_package.findOne({ $or: [{ state: "recieved-warehouse" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);

      doorstep_packages.delivered = await Door_step_Sent_package.findOne({ $or: [{ state: "dropped-to-agent" }, { state: "delivered" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);
      doorstep_packages.collected = await Door_step_Sent_package.findOne({ $or: [{ state: "collected" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .populate(
          "customerPhoneNumber packageName package_value package_value packageName customerName"
        )
        // .populate("agent")
        .sort({ createdAt: -1 })
        .limit(100);

      // doorstep_packages = await Door_step_Sent_package.find({
      //   createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey },{ customerPhoneNumber: searchKey }]
      // })
      //   .populate(
      //     "customerPhoneNumber packageName package_value package_value packageName customerName"
      //   )
      // .populate("agent")
      //   .sort({ createdAt: -1 })
      //   .limit(100);
      // shelves = await Rent_a_shelf_deliveries.find({ businessId: req.params.id, createdBy: req.user._id, $or: [{ packageName: searchKey }, { receipt_no: searchKey },{ customerPhoneNumber: searchKey }] }).populate(
      // );
      shelves.created = await Rent_a_shelf_deliveries.findOne({ state: "request", createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .sort({ createdAt: -1 })
        .limit(100);
      shelves.dropped = await Rent_a_shelf_deliveries.findOne({ $or: [{ state: "picked-from-seller" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
        .sort({ createdAt: -1 })
        .limit(100);
      shelves.collected = await Rent_a_shelf_deliveries.findOne({ $or: [{ state: "collected" }], createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
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
      shelves.dropped = await Rent_a_shelf_deliveries.find({ $or: [{ state: "agent" }, { state: "doorstep" }, { state: "picked-from-seller" }, { state: "early_collection" }], createdBy: req.user._id, businessId: req.params.id, })
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
router.get("/customers", [authMiddleware, authorized], async (req, res) => {

  try {
    let customers = await Customer.find({ seller: req.user._id })
    return res
      .status(200)
      .json(customers);

  } catch (error) {

  }
});
router.get("/booked-for-ealy-collection", [authMiddleware, authorized], async (req, res) => {
  try {
    const booked = await Rent_a_shelf_deliveries.find({ $or: [{ state: "early_collection" }], })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('businessId')
    return res
      .status(200)
      .json(booked);
  } catch (error) {
  }
});
router.get("/package/:id", async (req, res) => {
  try {
    const agent = await Sent_package.findById(req.params.id)
    const rent = await Rent_a_shelf_deliveries.findById(req.params.id)
    let package = await Door_step_Sent_package.findById(req.params.id).populate('agent')
    if (agent) {
      package = agent
    } else if (rent) {
      package = rent
    }
    const sender = await AgentDetails.findOne({ $or: [{ _id: package?.senderAgentID }, { _id: package?.receieverAgentID }, { _id: package?.agent }, { _id: rent?.location }] })

    return res
      .status(200)
      .json({
        package, sender: sender?.business_name,

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

    const users = await Collected.find().populate('package').populate('dispatchedBy').sort({ createdAt: -1 })
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
