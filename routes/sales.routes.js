const express = require('express');
var Sale = require('models/sales.model')
var Stock = require('models/stocks.model')
var User = require('models/user.model')
var Location = require('models/thrifter_location.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();
var fetch = require('node-fetch')
var { Headers}= fetch
const { SendMessage } = require('../helpers/sms.helper');
var unirest = require("unirest");
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

router.post('/mpesa-callback', [authMiddleware, authorized], async (req, res, next) => {
    // const Mpeslog = await new MpesaLogs({ log: JSON.stringify(req.body), user: req.user._id }).save()
    return res.status(200).json({ success: false, message: `payment made`, body: req.body, log: Mpeslog });
})


//access Token

async function generateToken() {

    try {

        let consumer_key = "FHvPyX8P8jJjXGqQJATzUvE1cDS3E4El", consumer_secret = "1GpfPi1UKAlMh2tI";
        var req = unirest("GET", "https://sandbox.safaricom.co.ke/oauth/v1/generate");
           req.query({
               "grant_type": "client_credentials"
            });
             
            req.headers({
             "authorization": `Basic ${new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64")}`
            });
             
            req.end(res => {
             if (res.error) throw new Error(res.error);
              return res.access_token;
            });
            
    } catch (error) {

        throw error;

    }

};

// console.log(generateToken());

// mpesa responce
router.post('/stk/response', async function (req, res) {
    var s = `${req.body.No}`;
    while (s.charAt(0) === '0') {
        s = s.substring(1);

    }
    const code = "254";
    let phone = `${code}${s}`;
   
    let token = await generateToken();

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer PMpdGugbJ1aOInbzfju2X6NvCYMi");
    
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
        "CallBackURL": "https://mydomain.com/path",
        "AccountReference": "CompanyXLTD",
        "TransactionDesc": "Payment of X" 
      })
    })
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log(error));

    
   

});



module.exports = router;