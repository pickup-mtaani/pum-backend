var fetch = require('node-fetch')
var axios = require('axios')
var { Headers } = fetch

const Mpesa_stk = (No, amount,user) => {
    let consumer_key = "FHvPyX8P8jJjXGqQJATzUvE1cDS3E4El", consumer_secret = "1GpfPi1UKAlMh2tI";
    var s = `${No}`;
    while (s.charAt(0) === '0') {
        s = s.substring(1);
    }
    const code = "254";
    let new_amount = parseInt(amount)
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
                    "Amount": new_amount,
                    "PartyA": phone,
                    "PartyB": 174379,
                    "PhoneNumber": phone,
                    "CallBackURL": "https://stagingapi.pickupmtaani.com/api/mpesa-callback",
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
                        user: user,
                        log: ''
                    }
                    await new MpesaLogs(body).save()
                    // data.Body.stkCallback.CallbackMetadata.Item[0].Value
                    // data.Body.stkCallback.CallbackMetadata.Item[0].Value
                    return res.status(200).json({ success: true, message: `payment made`, result });
                }

                )
                .catch(error => console.log(error));

        })
    return
    // console.log("token"+token);
}

module.exports = Mpesa_stk



