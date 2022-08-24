const express = require('express');
var Sale = require('models/sales.model')
var Stock = require('models/stocks.model')
var User = require('models/user.model')
var Location = require('models/thrifter_location.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();
var fetch = require('node-fetch')
var axios =require( 'axios')
var { Headers}= fetch
const { SendMessage } = require('../helpers/sms.helper');
var unirest = require("unirest");
var MpesaLogs =require("./../models/mpesa_logs.model");
router.post('/sale', [authMiddleware, authorized], async (req, res) => {
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

router.post('/mpesa-callback', async (req, res, next) => {
    console.log(JSON.stringify(req.body))
    const Mpeslog = await new MpesaLogs({ log: JSON.stringify(req.body)}).save()
    return res.status(200).json({ success: true, message: `payments fetched successfully`, body: req.body, log: Mpeslog });
})
router.get('/mpesa-payments', async (req, res, next) => {
  console.log(JSON.stringify(req.body))
  const mpeslog = await  MpesaLogs.find()
  return res.status(200).json({ success: true, message: `payments feched`, mpeslog });
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
    const Authorization = `Basic ${new Buffer.from(`${consumer_key}:${consumer_secret}`,'utf-8').toString('base64')}`;
    axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: {
          Authorization
        }
      })
      .then((response) => {
        let token = response.data.access_token;
        console.log(token);
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
            "Amount": amount,
            "PartyA": phone,
            "PartyB": 174379,
            "PhoneNumber": phone,
            "CallBackURL": "https://8d0a-197-248-235-245.eu.ngrok.io/api/mpesa-callback",
            "AccountReference": "Pick-up delivery",
            "TransactionDesc": "Payment delivery of  ***" 
          })
        })
          .then(response => {
            console.log(response.text)
            response.text()})
          .then(result => 
            {
                return res.status(200).json({ success: true, message: `payment made`, result });}

            )
          .catch(error => console.log(error));
    
      })
    return
// console.log("token"+token);
    
    
   

});



module.exports = router;