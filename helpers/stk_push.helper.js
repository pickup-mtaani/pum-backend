var fetch = require('node-fetch')
var axios = require('axios')
const mpesa_logsModel = require('../models/mpesa_logs.model')
var { Headers } = fetch

// const Mpesa_stk = async (No, amount, user, typeofDelivery) => {

//     let consumer_key = "FHvPyX8P8jJjXGqQJATzUvE1cDS3E4El", consumer_secret = "1GpfPi1UKAlMh2tI";
//     var s = `${No}`;
//     console.log(s)
//     while (s.charAt(0) === '0') {
//         s = s.substring(1);
//     }
//     const code = "254";
//     let new_amount = parseInt(amount)
//     let phone = `${code}${s}`;


//     const Authorization = `Basic ${new Buffer.from(`${consumer_key}:${consumer_secret}`, 'utf-8').toString('base64')}`;
//     axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
//         headers: {
//             Authorization
//         }
//     })
//         .then((response) => {
//             let code = ""
//             let token = response.data.access_token;
//             let headers = new Headers();
//             headers.append("Content-Type", "application/json");
//             headers.append("Authorization", `Bearer ${token}`);
//             fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
//                 method: 'POST',
//                 headers,
//                 body: JSON.stringify({
//                     "BusinessShortCode": 174379,
//                     "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjIwODE2MjIwNDQ3",
//                     "Timestamp": "20220816220447",
//                     "TransactionType": "CustomerPayBillOnline",
//                     // "Amount": new_amount,
//                     "Amount": 1,
//                     "PartyA": phone,
//                     "PartyB": 174379,
//                     "PhoneNumber": phone,
//                     "CallBackURL": "https://c3fa-197-248-89-7.eu.ngrok.io/api/mpesa-callbacks",
//                     "AccountReference": "Pick-up delivery",
//                     "TransactionDesc": "Payment delivery of  ***"
//                 })
//             })
//                 .then(response => {

//                     return response.json()
//                 })
//                 .then(async result => {
//                     let data = result
//                     const body = {
//                         MerchantRequestID: data.MerchantRequestID,
//                         CheckoutRequestID: data.CheckoutRequestID,
//                         phone_number: phone,
//                         amount: amount,
//                         ResponseCode: data.ResponseCode,
//                         type: typeofDelivery,

//                         user: user,
//                         log: ''
//                     }
//                     code = result.MerchantRequestID
//                     console.log("RESULT:", result.MerchantRequestID)
//                     // await new mpesa_logsModel(body).save()
//                     return body.MerchantRequestID;
//                 })
//                 .catch(error => console.log(error));
//             console.log(code)
//         })

//     return "mpesaCode"
//     // console.log("token"+token);
// }

// const Mpesa_stk = async (No, amount, user, typeofDelivery) => {

//     let consumer_key = "FHvPyX8P8jJjXGqQJATzUvE1cDS3E4El",
//         consumer_secret = "1GpfPi1UKAlMh2tI";
//     var s = `${No}`;

//     while (s.charAt(0) === "0") {
//         s = s.substring(1);
//     }
//     const code = "254";
//     let new_amount = parseInt(amount);
//     let phone = `${code}${s}`;


//     const Authorization = `Basic ${new Buffer.from(
//         `${consumer_key}:${consumer_secret}`,
//         "utf-8"
//     ).toString("base64")}`;

//     const response = await axios.get(
//         "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
//         {
//             headers: {
//                 Authorization,
//             },
//         }
//     );

//     let token = response.data.access_token;
//     let headers = new Headers();
//     headers.append("Content-Type", "application/json");
//     headers.append("Authorization", `Bearer ${token}`);
//     const fetch_response = await fetch(
//         "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
//         {
//             method: "POST",
//             headers,
//             body: JSON.stringify({
//                 BusinessShortCode: 174379,
//                 Password:
//                     "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjIwODE2MjIwNDQ3",
//                 Timestamp: "20220816220447",
//                 TransactionType: "CustomerPayBillOnline",
//                 // "Amount": new_amount,
//                 Amount: 1,
//                 PartyA: phone,
//                 PartyB: 174379,
//                 PhoneNumber: phone,
//                 CallBackURL: "https://d273-197-248-89-7.eu.ngrok.io/api/mpesa-callback",
//                 AccountReference: "Pick-up delivery",
//                 TransactionDesc: "Payment delivery of  *",
//             }),
//         }
//     );

//     const data = await fetch_response.json();
//     const body = {
//         MerchantRequestID: data.MerchantRequestID,
//         CheckoutRequestID: data.CheckoutRequestID,
//         phone_number: phone,
//         amount: amount,
//         ResponseCode: data.ResponseCode,
//         type: typeofDelivery,

//         user: user,
//         log: ''
//     }

//     // await new mpesa_logsModel(body).save()
//     //   mpesaCode = ret.MerchantRequestID;

//     //   console.log("MPESA CODE", ret);
//     return data;
//     // console.log("token"+token);
// };
const Mpesa_stk = async (No, amount, user, typeofDelivery) => {
    let consumer_key = "BIXdwG4MfjHyokYWYEAVI41G7D0YJQ50",
        consumer_secret = "XDRoAOxnM5NcgEBw";
    var s = `${No}`;

    while (s.charAt(0) === "0") {
        s = s.substring(1);
    }
    const code = "254";
    let new_amount = parseInt(amount);
    let phone = `${code}${s}`;

    const Authorization = `Basic ${new Buffer.from(
        `${consumer_key}:${consumer_secret}`,
        "utf-8"
    ).toString("base64")}`;

    const response = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
            headers: {
                Authorization,
            },
        }
    );

    let token = response.data.access_token;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);
    const fetch_response = await fetch(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                BusinessShortCode: 174379,
                Password:
                    "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjIwODE2MjIwNDQ3",
                Timestamp: "20220816220447",
                TransactionType: "CustomerPayBillOnline",
                // "Amount": new_amount,
                Amount: 1,
                PartyA: phone,
                PartyB: 174379,
                PhoneNumber: phone,
                CallBackURL: "https://171e-217-21-116-210.eu.ngrok.io/mpesa-callback",
                AccountReference: "Pick-up-delivery",
                TransactionDesc: "Payment delivery of  *",
            }),
        }
    );

    const data = await fetch_response.json();

    const body = {
        MerchantRequestID: data.MerchantRequestID,
        CheckoutRequestID: data.CheckoutRequestID,
        phone_number: phone,
        amount: amount,
        ResponseCode: data.ResponseCode,
        type: typeofDelivery,

        // user: user,
        log: ''
    }
    let T = await new mpesa_logsModel(body).save()
    console.log(T)
    //   mpesaCode = ret.MerchantRequestID;

    //   console.log("MPESA CODE", ret);
    return data;
    // console.log("token"+token);
};
module.exports = Mpesa_stk



