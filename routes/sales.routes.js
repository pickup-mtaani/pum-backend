const express = require('express');
var Sale = require('models/sales.model')
var Stock = require('models/stocks.model')
var User = require('models/user.model')
var Location = require('models/thrifter_location.model')
var AgentPackage = require("models/agent_agent_delivery.modal.js");
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
    console.log("BODY", req.body)
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
router.post("/sales-pay/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    let v = await Mpesa_stk(req.body.phone_number, 1)
    await Sale.findOneAndUpdate({ _id: req.params.id }, { payment_status: true }, { new: true, useFindAndModify: false })
    return res
      .status(200)
      .json({});
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

router.get('/mpesa-payments', async (req, res, next) => {
  const mpeslog = await MpesaLogs.find().populate('user')
  return res.status(200).json({ success: true, message: `payments feched`, mpeslog });
})
// router.get('/mpesa-callback', async (req, res, next) => {
//   console.log("Get-Back:", "req.body")
//   return
// })
router.post('/mpesa-callback', async (req, res, next) => {

  console.log("Call-Back:", req.body)
  return
  try {

    const Update = await MpesaLogs.findOneAndUpdate(
      {
        MerchantRequestID: req.body.Body?.stkCallback?.MerchantRequestID
      }, {
      log: JSON.stringify(req.body), ResultDesc: req.body.Body?.stkCallback?.ResultDesc,
      ResponseCode: req.body.Body?.stkCallback?.ResultCode,
      MpesaReceiptNumber: req.body.Body?.stkCallback?.CallbackMetadata?.Item[1]?.Value
    }, { new: true, useFindAndModify: false })

    const LogedMpesa = await MpesaLogs.findOne({ MerchantRequestID: Update?.MerchantRequestID })


    if (LogedMpesa.type === "doorstep") {

      const UpdatePackage = await Doorstep_pack.findOneAndUpdate(
        {
          _id: LogedMpesa.package
        }, {
        payment_status: req.body.Body?.stkCallback?.ResultDesc,
      }, { new: true, useFindAndModify: false })
    }
    else if (LogedMpesa.type === "agent") {

      const UpdatePackage = await AgentPackage.findOneAndUpdate(
        {
          _id: LogedMpesa.package
        }, {
        payment_status: req.body.Body?.stkCallback?.ResultDesc,
      }, { new: true, useFindAndModify: false })
    }

    return res.status(200).json({ success: true, message: `payments made successfully`, body: req.body });
  } catch (error) {
    console.log(error)
  }
})

router.post('/mpesa_payment/stk', async function (req, res) {
  let consumer_key = "FHvPyX8P8jJjXGqQJATzUvE1cDS3E4El", consumer_secret = "1GpfPi1UKAlMh2tI";
  var s = `${req.body.No}`;
  while (s.charAt(0) === '0') {
    s = s.substring(1);
  }
  const code = "254";
  let amount = parseInt(req.body.amount)
  let phone = `${code}${s}`;

  const Authorization = `Basic ${new Buffer.from(`${consumer_key}:${consumer_secret}`, 'utf-8').toString('base64')}`;
  axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    headers: {
      Authorization
    }
  })
    .then((response) => {
      let token = response.data.access_token;
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", `Bearer ${token}`);
      fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
        method: 'POST',
        headers,
        body: JSON.stringify({
          "BusinessShortCode": 174379,
          "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjIwODE2MjIwNDQ3",
          "Timestamp": "20220816220447",
          "TransactionType": "CustomerPayBillOnline",
          "Amount": 1,
          "PartyA": 254720141534,
          "PartyB": 174379,
          "PhoneNumber": 254720141534,
          "CallBackURL": "https://famous-actors-itch-217-21-116-210.loca.lt/api/mpesa-callback",
          "AccountReference": "Pick-up delivery",
          "TransactionDesc": "Payment delivery of  ***"
        })
      })
        .then(response => {
          // console.log("response.tex" + JSON.stringify(response));

          return response.json()
        })
        .then(async result => {
          let data = result
          const body = {
            MerchantRequestID: data.MerchantRequestID,
            CheckoutRequestID: data.CheckoutRequestID,
            phone_number: phone,
            amount: amount,
            ResponseCode: data.ResponseCode,
            // user: req.user._id,
            log: ''
          }
          // await new MpesaLogs(body).save()
          // data.Body.stkCallback.CallbackMetadata.Item[0].Value
          // data.Body.stkCallback.CallbackMetadata.Item[0].Value
          return res.status(200).json({ success: true, message: `payment made`, result });
        }

        )
        .catch(error => console.log(error));

    })
  return
  // console.log("token"+token);




});



module.exports = router;