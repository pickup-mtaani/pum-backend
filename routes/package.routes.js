const express = require("express");
var Rent = require("models/rent_a_shelf_delivery.model");
var Rent_a_shelf_deliveries = require("models/rent_a_shelf_deliveries");
// var Agent = require("models/agents.model");
var AgentDetails = require("models/agentAddmin.model");
var RiderRoutes = require("models/rider_routes.model");
var Collected = require("models/collectors.model");
var Customer = require("models/customer.model");
var Unavailable = require("models/unavailable.model");
// var AgentLocation = require('models/agents.model')
var Zone = require('models/zones.model');
var rentshelfNarations = require('models/rent_shelf_narations.model');
var Track_rent_a_shelf = require('models/rent_shelf_package_track.model');
var Track_door_step = require('models/door_step_package_track.model');
var Track_Erand = require('models/erand_package_track.model');
var Track_agent_packages = require('models/agent_package_track.model');
var Bussiness = require("models/business.model");
var Commision = require("models/commission.model");
var Product = require("models/products.model.js");
var Rider_Package = require('models/rider_package.model')
var Notification = require("models/notification.model");
var Sent_package = require("models/package.modal.js");
var Door_step_Sent_package = require("models/doorStep_delivery_packages.model");
var Erand_package = require("models/erand_delivery_packages.model");
var Reject = require("models/Rejected_parcels.model");
var Courrier = require("models/courier.model");
var AgentUser = require('models/agent_user.model');
var BizDetails = require('models/business_details.model');
var User = require('models/user.model');
var {
  authMiddleware,
  authorized,
} = require("middlewere/authorization.middlewere");
const { Makeid } = require("../helpers/randomNo.helper");
const { SendMessage } = require("../helpers/sms.helper");
const moment = require("moment");
const Mpesa_stk = require("../helpers/stk_push.helper");
var AgentLocation = require('models/agents.model')
const Format_phone_number = require("../helpers/phone_number_formater");
const { request } = require("express");
const { reject } = require("../frontend/src/redux/actions/location.actions");
const router = express.Router();
function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
router.post("/package", [authMiddleware, authorized], async (req, res) => {
  let auth = await User.findById(req.user._id)
  let newpackage
  try {
    const body = req.body;

    body.createdBy = req.user._id;
    if (body.delivery_type === "door_step") {

      const { packages } = req.body;

      for (let i = 0; i < packages.length; i++) {
        let agent_id = await AgentDetails.findOne({ _id: packages[i].agent })
        let zone = await Zone.findOne({ _id: agent_id.location_id })
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
        packages[i].createdAt = moment().format('YYYY-MM-DD');
        packages[i].time = moment().format('hh:mm');
        newpackage = await new Door_step_Sent_package(packages[i]).save();
        await new Notification({ dispachedTo: packages[i].createdBy, receipt_no: `${packages[i].receipt_no}`, p_type: 2, s_type: 1, descriptions: ` Package #${package.receipt_no}  created` }).save()

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
    } else if (body.delivery_type === "errand") {
      const { packages } = req.body;
      for (let i = 0; i < packages.length; i++) {
        let agent_id = await AgentDetails.findOne({ _id: packages[i].agent })
        let newPackageCount = 1
        if (agent_id?.package_count) {
          newPackageCount = parseInt(agent_id?.package_count + 1)
        }
        let route = await RiderRoutes.findOne({ agent: agent_id._id })
        if (packages[i].other) {
          let data = { name: packages[i].other, descriptions: packages[i].other }
          let courriers = await new Courrier(data).save();
          packages[i].courier = courriers._id
        }
        if (packages[i]?.product) {

          const product = await Product.findById(packages[i].product);
          packages[i].packageName = product.product_name;
          packages[i].isProduct = true;
          packages[i].package_value = product.price
          packages[i].payment_status = "paid"
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
        packages[i].destination = body?.packages[i]?.destination
        packages[i].receipt_no = `${agent_id.prefix}${newPackageCount}`;
        packages[i].assignedTo = route.rider

        let customer = await Customer.findOne({ seller: req.user._id, customer_phone_number: packages[i].customerPhoneNumber })
        if (customer === null) {
          await new Customer({ erands_package_count: 1, total_package_count: 1, seller: req.user._id, customer_name: packages[i].customerName, customer_phone_number: packages[i].customerPhoneNumber }).save()
        }
        else {
          await Customer.findOneAndUpdate({ seller: req.user._id, }, { erands_package_count: parseInt(customer.erands_package_count + 1), total_package_count: parseInt(customer.total_package_count + 1) }, { new: true, useFindAndModify: false })
        }
        // if (packages[i].pipe === "erand") {
        //   packages[i].state = "pending-erand"
        //   await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: packages[i].p_id }, { state: "erand" }, { new: true, useFindAndModify: false })
        // }
        packages[i].createdAt = moment().format('YYYY-MM-DD');
        packages[i].time = moment().format('hh:mm');
        newpackage = await new Erand_package(packages[i]).save();
        await new Notification({ dispachedTo: packages[i].createdBy, receipt_no: `${packages[i].receipt_no}`, p_type: 4, s_type: 1, descriptions: ` Package #${package.receipt_no}  created` }).save()

        let V = await new Track_Erand({
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
        await Mpesa_stk(req.body.payment_phone_number, req.body.total_payment_amount, req.user._id, "erand")
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

        let business = await Bussiness.findById(packages[i].businessId)
        let details = await BizDetails.findById(business.details)
        let agent_id = await AgentDetails.findOne({ _id: details.agent })
        // console.log("Paack", agent_id)
        let newPackageCount = 1
        if (agent_id?.package_count) {
          newPackageCount = parseInt(agent_id?.package_count + 1)
        }
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
        packages[i].location = business.shelf_location;
        packages[i].createdBy = req.user._id;
        packages[i].businessId = req.body.businessId;
        packages[i].receipt_no = `PMT-RTF-${parseInt(agent_id?.package_count + 1)}`;
        packages[i].createdAt = moment().format('YYYY-MM-DD');
        packages[i].time = moment().format('hh:mm');
        const savedPackage = await new Rent_a_shelf_deliveries(
          packages[i]
        ).save();
        await AgentDetails.findOneAndUpdate({ _id: details.agent }, { package_count: newPackageCount }, { new: true, useFindAndModify: false })

        await new Notification({ dispachedTo: packages[i].createdBy, receipt_no: `${packages[i].receipt_no}`, p_type: 3, s_type: 1, descriptions: ` Package #${packages[i].receipt_no}  created` }).save()

        let customer = await Customer.findOne({ seller: req.user._id, customer_phone_number: packages[i].customerPhoneNumber })
        if (customer === null) {
          await new Customer({ rent_shelf_package_count: 1, seller: req.user._id, customer_name: packages[i].customerName, customer_phone_number: packages[i].customerPhoneNumber, total_package_count: 1 }).save()
        } else {
          await Customer.findOneAndUpdate({ seller: req.user._id, }, { rent_shelf_package_count: parseInt(customer.rent_shelf_package_count + 1), total_package_count: parseInt(customer.total_package_count + 1) }, { new: true, useFindAndModify: false })
        }
        await new Track_rent_a_shelf({
          package: savedPackage._id,
          created: moment(),
          state: "request",
          descriptions: [{ time: moment(), descriptions: `Pkg ${packages[i].receipt_no} created by ${business.name}` }],
          reciept: savedPackage.receipt_no
        }).save()
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
        let business = await Bussiness.findById(packages[i].businessId)
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
        // if (!route) {
        //   return res
        //     .status(400)
        //     .json({ message: "The sender agent has no rider kindly select a different agent " });
        // }
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
        packages[i].createdAt = moment().format('YYYY-MM-DD');
        packages[i].time = moment().format('hh:mm');

        let savedPackage = await new Sent_package(packages[i]).save();
        await new Track_agent_packages({
          package: savedPackage._id,
          created: moment(),
          state: "request",
          descriptions: [{ time: moment(), descriptions: `Pkg ${packages[i].receipt_no} created by ${business.name}` }],
          reciept: savedPackage.receipt_no
        }).save()
        await new Notification({ dispachedTo: packages[i].createdBy, receipt_no: `${packages[i].receipt_no}`, p_type: 1, s_type: 1, descriptions: ` Package #${packages[i].receipt_no}  created` }).save()

        // packages[i].assignedTo = route.rider
        let customer = await Customer.findOne({ seller: req.user._id, customer_phone_number: packages[i].customerPhoneNumber })
        if (customer === null) {
          await new Customer({ seller: req.user._id, customer_name: packages[i].customerName, customer_phone_number: packages[i].customerPhoneNumber, total_package_count: 1, agent_package_count: 1 }).save()
        }
        else {
          await Customer.findOneAndUpdate({ seller: req.user._id, }, { agent_package_count: parseInt(customer.agent_package_count + 1), total_package_count: parseInt(customer.total_package_count + 1) }, { new: true, useFindAndModify: false })
        }
        await AgentDetails.findOneAndUpdate({ _id: packages[i].senderAgentID }, { package_count: newPackageCount }, { new: true, useFindAndModify: false })
        // await new Narations({ package: newpackage._id, state: "request", descriptions: `Package created` }).save()


        if (req.body.payment_option === "collection") {
          // await Mpesa_stk(req.body.payment_phone_number, req.body.total_payment_amount, req.user._id, "agent", packages)
          await Sent_package.findOneAndUpdate({ _id: newpackage._id }, { hasBalance: true }, { new: true, useFindAndModify: false })
        }
      }
      if (req.body.payment_option === "vendor") {
        // await Mpesa_stk(req.body.payment_phone_number, req.body.total_payment_amount, req.user._id, "agent", packages)
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

    let price;
    const { senderAgentID, receieverAgentID } = req.body;

    const sender = await AgentDetails.findOne({ _id: senderAgentID })

    const receiver = await AgentDetails.findOne({ _id: receieverAgentID })
    let recieverZone = await AgentLocation.findOne({ _id: sender?.location_id }).populate('zone')
    let senderZone = await AgentLocation.findOne({ _id: receiver?.location_id }).populate('zone')
    console.log("sender", senderZone?.zone?.name)
    console.log("reciever", recieverZone?.zone?.name)
    if (
      (senderZone?.zone.name === "Zone A" && recieverZone?.zone.name === "Zone B")
    ) {
      price = 100;
      return res.status(200).json({ message: "price set successfully ", price });

    }
    else if ((senderZone?.zone.name === "Zone B" && recieverZone?.zone.name === "Zone A")) {
      price = 150;
      return res.status(200).json({ message: "price set successfully ", price });

    } else if ((senderZone?.zone.name === "Zone B" && recieverZone?.zone.name === "Zone B")
    ) {
      price = 100
      return res.status(200).json({ message: "price set successfully ", price });

    } else if ((senderZone?.zone.name === "Zone A" && recieverZone?.zone.name === "Zone C")
    ) {
      price = 250
      return res.status(200).json({ message: "price set successfully ", price });
    }
    else if (senderZone?.zone.name === "Zone B" && recieverZone?.zone.name === "Zone C") {
      price = 200;
      return res.status(200).json({ message: "price set successfully ", price });
    } else if (senderZone?.zone.name === "Zone B" && recieverZone?.zone.name === "Zone A") {
      price = 100;
      return res.status(200).json({ message: "price set successfully ", price });

    }

    else if (senderZone?.zone.name === "Zone C" && recieverZone?.zone.name === "Zone C") {
      price = 250
      return res.status(200).json({ message: "price set successfully ", price });

    } else {

      return res.status(200).json({ message: "price setting in progress  " })

    }

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/agents/test/viaob/hgfh", async (req, res) => {
  try {

    let price;

    const sender = await AgentDetails.findOne({ _id: senderAgentID }).populate("location_id");

    const receiver = await AgentDetails.findOne({ _id: receieverAgentID }).populate("location_id");
    // let recieverZone = await AgentLocation.findOne({ _id: sender.location_id }).populate('zone')
    let senderZone = await AgentLocation.find().populate('zone')
    // console.log("sender", recieverZone)
    console.log("reciever", senderZone)

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
    let business = await Bussiness.findById(package.businessId._id)
    let shelf = await AgentDetails.findById(business.shelf_location)
    let auth = await User.findById(req.user._id)
    let narration = await Track_rent_a_shelf.findOne({ package: req.params.id })
    await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state }, { new: true, useFindAndModify: false })
    let notefications = []
    const { state } = req.params
    let seller = global.sellers?.find((sel) => sel.seller === `${package.createdBy}`)?.socket
    if (seller) {
      switch (state) {
        case "request":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 3, s_type: 1, descriptions: ` Package #${package.receipt_no}  created` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });

          break;
        case "picked-from-seller":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 3, s_type: 2, descriptions: ` Package #${package.receipt_no}  picked from sender` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });

          break;
        case "collected":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 3, s_type: 11, descriptions: ` Package #${package.receipt_no}  collected` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });
          break;
        case "rejected":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 3, s_type: 0, descriptions: ` Package #${package.receipt_no}  been assigned to a rider from the warehouse` }).save()
          notefications = await Notification.find({ dispachedTo: package.createdBy }).sort({ createdAt: -1 }).limit(9)
          global.io.to(seller).emit("change-state", { notifications: notefications });

        case "early_collection":
          await new Notification({ dispachedTo: package.createdBy, receipt_no: `${package.receipt_no}`, p_type: 3, s_type: 12, descriptions: ` Package #${package.receipt_no}  booked for early collection` }).save()
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
      console.log("first", req.body)
      let reject = await new Reject({ package: req.params.id, reject_reason: req.body.rejectReason }).save()
      await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: req.params.id }, { state: req.params.state, rejectedId: reject._id }, { new: true, useFindAndModify: false })
      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg ${package.receipt_no} was rejected by ${auth?.name} because ${req.body.rejectReason} ` }]

      await Track_rent_a_shelf.findOneAndUpdate({ package: req.params.id }, { descriptions: new_des, rejectedAt: Date.now() }, { new: true, useFindAndModify: false })

    }
    if (req.params.state === "picked-from-seller") {

      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg ${package.receipt_no} drop-off confirmed by ${auth?.name}  at ${shelf.business_name} ` }]
      await Track_rent_a_shelf.findOneAndUpdate({ package: req.params.id }, {
        droppedTo: business.shelf_location, droppedAt: Date.now(),
        descriptions: new_des
      }, { new: true, useFindAndModify: false })
      const textbody = {
        address: Format_phone_number(`${package.customerPhoneNumber}`), Body: `Hello  ${package.customerName}, Collect parcel ${package.receipt_no} from ${package?.businessId?.name} at Philadelphia house Track now:  pickupmtaani.com
      ` }
      await SendMessage(textbody)
      let payments = getRandomNumberBetween(100, 200)
      await new Commision({ agent: req.user._id, rent_shelf: req.params.id, commision: 0.1 * parseInt(payments) }).save()


    }

    if (req.params.state === "collected" && package.booked === true) {
      let collector = await Collected.findOneAndUpdate({ package: req.params.id }, {
        collector_signature: req.body.collector_signature
      }, { new: true, useFindAndModify: false })
      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg ${package.receipt_no} was given out to ${collector.collector_name} of phone No 0${collector.substring(1, 4)}xxx xxxx by  ${auth?.name} ` }]


      await Track_rent_a_shelf.findOneAndUpdate({ package: req.params.id }, { descriptions: new_des, collectedby: collector._id, collectedAt: Date.now() }, { new: true, useFindAndModify: false })

    }
    if (req.params.state === "collected" && package.booked !== true) {
      req.body.package = req.params.id
      req.body.dispatchedBy = req.user._id
      let collector = await new Collected(req.body).save()
      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg ${package.receipt_no} was given out to ${collector.collector_name} of phone No 0${collector.collector_phone_number.substring(1, 4)}xxx xxxx by  ${auth?.name}  ` }]
      await Track_rent_a_shelf.findOneAndUpdate({ package: req.params.id }, { descriptions: new_des, collectedby: collector._id, collectedAt: Date.now() }, { new: true, useFindAndModify: false })

    }
    if (req.params.state === "early_collection") {
      req.body.package = req.params.id
      req.body.dispatchedBy = req.user._id
      await new Collected(req.body).save()
      let new_des = [...narration.descriptions, { time: Date.now(), desc: `Pkg ${package.receipt_no} was booked ${req.body.collector_name} of phone No 0${req.body.substring(1, 4)}xxx xxxx by  ${auth?.name}  ` }]

      await Track_rent_a_shelf.findOneAndUpdate({ package: req.params.id }, {
        booked: {
          bookedBy: req.user._id,
          bookedAt: moment(),
          bookedFor: req.body.time
        },
        descriptions: new_des,
      }, { new: true, useFindAndModify: false })
      await Rent_a_shelf_deliveries.findOneAndUpdate({ _id: req.params.id }, { booked: true, booked: booked, descriptions: new_des }, { new: true, useFindAndModify: false })
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

    agent_packages = await Rent_a_shelf_deliveries.find({ location: agent.agent, state: req.params.state }).sort({ createdAt: -1 }).limit(100)
      .populate('location')
      .populate('businessId')
      .populate('createdBy')
      .populate('rejectedId', 'reject_reason')
    return res.status(200)
      .json(agent_packages);

  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/rent-shelf-search/:state", [authMiddleware, authorized], async (req, res) => {
  let agent = await AgentUser.findOne({ user: req.user._id })
  try {
    let agent_packages

    var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
    console.log(searchKey)
    agent_packages = await Rent_a_shelf_deliveries.find({ state: req.params.state, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] }).sort({ createdAt: -1 }).limit(100)
      .populate('location')
      .populate('businessId')
      .populate('createdBy')
      .populate('rejectedId', 'reject_reason')
    return res.status(200)
      .json(agent_packages);

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
router.get("/rent-rider-shelf-package-count", [authMiddleware, authorized], async (req, res) => {
  let agent = await AgentUser.findOne({ user: req.user._id })
  const agentDetaoils = await AgentDetails.findOne({ user: req.user._id });

  try {

    let dropped = await Rent_a_shelf_deliveries.find({ assignedTo: req.user._id, state: "picked-from-seller" })
    let unavailable = await Rent_a_shelf_deliveries.find({ assignedTo: req.user._id, state: "unavailable" })
    let picked = await Rent_a_shelf_deliveries.find({ assignedTo: req.user._id, state: "picked" })
    let request = await Rent_a_shelf_deliveries.find({ assignedTo: req.user._id, state: "request" })
    let collected = await Rent_a_shelf_deliveries.find({ assignedTo: req.user._id, state: "collected" })
    let rejected = await Rent_a_shelf_deliveries.find({ assignedTo: req.user._id, state: "rejected" })
    let onTransit = await Rent_a_shelf_deliveries.find({ assignedTo: req.user._id, state: "on-transit" })
    let cancelled = await Rent_a_shelf_deliveries.find({ assignedTo: req.user._id, state: "cancelled" })
    let droppedToagent = await Rent_a_shelf_deliveries.find({ assignedTo: req.user._id, state: "dropped-to-agent" })
    let assigned = await Rent_a_shelf_deliveries.find({ assignedTo: req.user._id, state: "assigned" })
    let agentOrderRequest = await Sent_package.find({ payment_status: "paid", state: "pending-agent" }).sort({ createdAt: -1 }).limit(100)
    let earlyOrderRequest = await Rent_a_shelf_deliveries.find({ assignedTo: req.user._id, $or: [{ state: "early_collection" }] })
    let doorSteporderRequest = await Door_step_Sent_package.find({ $or: [{ payment_status: "paid" }, { payment_status: "to-be-paid" }], state: "pending-doorstep" }).sort({ createdAt: -1 }).limit(100).populate('createdBy', 'f_name l_name name phone_number').populate('businessId').populate('agent');
    let pickedfromSender = await Rent_a_shelf_deliveries.find({ assignedTo: req.user._id, $or: [{ state: "picked-from-seller" }] })
    let incomingStock = await Product.find({
      pending_stock: {
        $gt: 0
      }
    })
    return res.status(200)
      .json({ message: "Fetched Sucessfully after", earlyOrderRequest: earlyOrderRequest.length, doorSteporderRequest: doorSteporderRequest.length, agentOrderRequest: agentOrderRequest.length, incomingStock: incomingStock.length, pickedfromSender: pickedfromSender.length, cancelled: cancelled.length, droppedToagent: droppedToagent.length, assigned: assigned.length, dropped: dropped.length, unavailable: unavailable.length, picked: picked.length, request: request.length, collected: collected.length, rejected: rejected.length, onTransit: onTransit.length });

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
router.get("/user-rent-shelf-package-search/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
    let packages = await Rent_a_shelf_deliveries.find({ createdBy: req.user._id, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] })
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
