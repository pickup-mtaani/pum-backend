var fetch = require('node-fetch')
var axios = require('axios')
var moment = require('moment');
const mpesa_logsModel = require('../models/mpesa_logs.model')
var { Headers } = fetch

const Mpesa_stk = async (No, amount, user, typeofDelivery, id) => {
    let consumer_key = process.env.MPESA_CONSUMER_KEY,
        consumer_secret = process.env.MPESA_CONSUMER_SECRETE,
        passkey = process.env.MPESA_CONSUMER_PASSKEY,
        short_code = parseInt(process.env.MPESA_SHORT_CODE),
        timestamp = moment().format('YYYYMMDDHHmmss');
    var s = `${No}`;
    // console.log("PHONe", s)
    // console.log(`Timestamp: ${timestamp}`);
    // console.log(`Passwords: ${new Buffer.from(`${short_code}${passkey}${timestamp}`).toString('base64')}`);
    // return
    while (s.charAt(0) === "0") {
        s = s.substring(1);
    }
    const code = "254";
    let new_amount = parseInt(amount);
    let phone = `${code}${s}`;

    const Authorization = `Bearer ${new Buffer.from(
        `${consumer_key}:${consumer_secret}`,
        "utf-8"
    ).toString("base64")}`;

    // console.log('Generating Token')

    const response = await axios.get(
        `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
        "headers": {
            "Authorization": `Basic ${new Buffer.from(`${consumer_key}:${consumer_secret}`).toString("base64")}`
        }
    }
    );

    let token = response.data.access_token;
    // return
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);
    const fetch_response = await fetch(
        `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                BusinessShortCode: 5684653,
                Password: new Buffer.from(`${short_code}${passkey}${timestamp}`).toString('base64'),
                Timestamp: `${timestamp}`,
                TransactionType: "CustomerPayBillOnline",
                Amount: 1,
                PartyA: phone,
                PartyB: 5684653,
                PhoneNumber: phone,
                CallBackURL: `${process.env.MPESA_CALLbACK}`,
                AccountReference: "Pick-up-delivery",
                TransactionDesc: "Payment delivery of  *",
            }),
        }
    );
    const data = await fetch_response.json();
    console.log(data)
    console.log(JSON.stringify({
        BusinessShortCode: short_code,
        Password: new Buffer.from(`${short_code}${passkey}${timestamp}`).toString('base64'),
        Timestamp: `${timestamp}`,
        TransactionType: "CustomerPayBillOnline",
        Amount: 1,
        PartyA: phone,
        PartyB: short_code,
        PhoneNumber: phone,
        CallBackURL: `${process.env.MPESA_CALLbACK}`,
        AccountReference: "Pick-up-delivery",
        TransactionDesc: "Payment delivery of  *",
    }));
    let package_id

    const body = {
        MerchantRequestID: data.MerchantRequestID,
        CheckoutRequestID: data.CheckoutRequestID,
        phone_number: phone,
        amount: amount,
        ResponseCode: data.ResponseCode,
        type: typeofDelivery,
        package: id,
        user: user,
        log: ''
    }
    if (typeofDelivery === "errand") {
        body.errand_package = id
        body.package = null
    }
    if (typeofDelivery === "doorstep") {
        body.doorstep_package = id
    }

    await new mpesa_logsModel(body).save()

    return data;

};
module.exports = Mpesa_stk



