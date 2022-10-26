var fetch = require('node-fetch')
var axios = require('axios')
const mpesa_logsModel = require('../models/mpesa_logs.model')
var { Headers } = fetch

const Mpesa_stk = async (No, amount, user, typeofDelivery) => {
    console.log(No)
    let consumer_key = "FHvPyX8P8jJjXGqQJATzUvE1cDS3E4El", consumer_secret = "1GpfPi1UKAlMh2tI";
    var s = `${No}`;
    let phone
    if (s.charAt(0) === '+') {
        s = s.substring(1);
    }
    if (s.charAt(0) === '0') {
        s = s.substring(1);
        const code = "254";
        phone = `${code}${s}`;
    } else {
        return
    }

    console.log(phone)
    let new_amount = parseInt(amount)

    var mpesaCode = ""

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
                    // "Amount": new_amount,
                    "Amount": 1,
                    "PartyA": phone,
                    "PartyB": 174379,
                    "PhoneNumber": phone,
                    "CallBackURL": "https://e1ee-217-21-116-210.eu.ngrok.io/api/mpesa-callback",
                    "AccountReference": "Pick-up delivery",
                    "TransactionDesc": "Payment delivery of  ***"
                })
            })
                .then(response => {

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
                        type: typeofDelivery,

                        user: user,
                        log: ''
                    }
                    mpesaCode = body.MerchantRequestID

                    await new mpesa_logsModel(body).save()
                    return;
                })
                .catch(error => console.log(error));

        })

    return mpesaCode
    // console.log("token"+token);
}

module.exports = Mpesa_stk



