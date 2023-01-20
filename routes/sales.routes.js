const express = require('express');
var Sale = require('models/sales.model')
var Stock = require('models/stocks.model')
var User = require('models/user.model')
var Location = require('models/thrifter_location.model')
var AgentPackage = require("models/agent_agent_delivery.modal.js");
var Sent_package = require("models/package.modal.js");
var Doorstep_pack = require("models/doorStep_delivery.model");
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();
var fetch = require('node-fetch')
var axios = require('axios')
var Customer = require("models/customer.model");
var Product = require('models/products.model')
var Bussiness = require('models/business.model')
var moment = require('moment')
var { Headers } = fetch
const { SendMessage } = require('../helpers/sms.helper');
var unirest = require("unirest");
var MpesaLogs = require("./../models/mpesa_logs.model");
const { getLogger } = require('nodemailer/lib/shared');
const Mpesa_stk = require('../helpers/stk_push.helper');
router.post('/sales', [authMiddleware, authorized], async (req, res) => {
  try {
    Exists = await Stock.findOne({ business: req.body.business, product: req.body.product }).populate(['business', 'createdBy', 'product']);
    const newqty = parseInt(Exists.qty) - parseInt(req.body.qty)
    const Agent = await Location.findById(Exists.business.shelf_location).populate("user_id")
    if (newqty < 0) {
      return res.status(400).json({ success: false, message: 'Current stock is not enough kindly Restock ' });
    } else {
      const body = req.body
      body.createdBy = req.user._id
      const newSale = new Sale(body)
      const saved = await newSale.save()
      await Stock.findOneAndUpdate({ _id: Exists._id }, { qty: newqty }, { new: true, useFindAndModify: false })

      const Business = await User.findById(Exists.business.createdBy)
      const Sold = await Sale.findOne({ _id: saved._id }).populate(['business', 'createdBy', 'product']);
      const Agency = await User.findById(Agent.user_id._id)


      if (Exists.business.createdBy !== req.user._id) {
        const TextObj = { address: `${Business.phone_number}`, Body: `Hi ${Business.username}\n${saved.qty} Pc(s) of  ${Sold.product.product_name}  has been Sold out and your new stock is ${newqty} ` }
        await SendMessage(TextObj)
        return res.status(200).json({ message: 'Sale Added successfully', saved: saved });
      } else {
        const TextObj = { address: `${Agency.phone_number}`, Body: `Hi ${Agency.username}\n${saved.qty} Pc(s) of  ${Sold.product.product_name}  has been Sold out by ${Business.username} and the new stock is ${newqty} ` }
        await SendMessage(TextObj)
        return res.status(200).json({ message: 'Sale Added successfully', saved: saved });
      }

    }

  } catch (error) {

    return res.status(400).json({ success: false, message: 'operation failed ', error });

  }

});

router.post('/sell', [authMiddleware, authorized], async (req, res) => {
  try {

    // const prod = await Product.findOne({ _id: req.body.product, business: req.body.body.business })
    const body = req.body
    body.createdBy = req.user._id
    const { products } = req.body
    if (req.body.products) {
      const item = products
      let products_name = products?.map(function (item) {
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
      body.packageName = products_name;
      body.package_value = products_price;
    }
    const sale = await new Sale(body).save()
    return res.status(200).json(sale);
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: 'operation failed ', error });
  }

});

router.get('/todays-sales', [authMiddleware, authorized], async (req, res) => {
  try {
    var start = new Date();
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);
    const sales = await Sale.find({ createdBy: req.user._id, createdAt: { $gte: start, $lt: end } }).populate('business')
    return res.status(200).json(sales);
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: 'operation failed ', error });

  }

});

module.exports = router;