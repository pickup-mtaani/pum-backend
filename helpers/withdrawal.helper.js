const axios = require("axios");

const validators = require("../helpers/validator.helper");
const WithdrawalModel = require("../models/withdraws.model.js");

const handleB2C = async (withdrawal_amount, withdrawal_phone, w_id) => {
  try {
    const encode = new Buffer.from(
      `${process.env.MPESA_TRANSACTION_CONSUMER_KEY}:${process.env.MPESA_TRANSACTION_CONSUMER_SECRET}`
    ).toString("base64");
    const valid_phone_number = validators.validatePhone(withdrawal_phone);
    var config = {
      method: "get",
      url: "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${encode}`,
      },
    };
    const r = await axios(config);
    // console.log("WITHDRAWAL AUTH RESPONSE", r?.data);

    const query_response = await axios.post(
      process.env.MPESA_URL,
      {
        InitiatorName: "testapi",
        SecurityCredential: process.env.MPESA_B2C_SECURITY_CREDENTIALS,
        CommandID: process.env.MPESA_B2C_COMMAND_ID,
        Amount: withdrawal_amount,
        PartyA: process.env.MPESA_B2C_CODE,
        PartyB: valid_phone_number,
        ResultURL: process.env.BASE_URL + "/withdrawals/callback",
        QueueTimeOutURL: process.env.BASE_URL + "/withdrawals/queuetimeouturl",
        Remarks: "Collect my cash withdrawal",
        // Occasion: ""
      },
      {
        headers: {
          ["Content-Type"]: "application/json",
          Authorization: `Bearer ${r.data?.access_token}`,
        },
      }
    );
    const { data } = query_response;

    const withdrawal = {
      ConversationID: data?.ConversationID,
      OriginatorConversationID: data?.OriginatorConversationID,
      ResponseCode: data?.ResponseCode,
      ResponseDesc: data?.ResponseDescription,
    };

    await WithdrawalModel.findByIdAndUpdate(w_id, withdrawal);
    return withdrawal;
  } catch (error) {
    console.log("B2C ERROR:", error);
  }

  // console.log("TRANSACTION QUERY: ", query_response);

  // return query_response?.data
};

module.exports = handleB2C;
