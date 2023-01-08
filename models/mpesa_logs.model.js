var mongoose = require('mongoose');

const Schema = mongoose.Schema;


const MpesaLogsSchema = new Schema({

    log: {

        type: String

    },
    MerchantRequestID: {

        type: String

    },
    type: {
        type: String
    },
    package: {
        type: Schema.Types.ObjectId,
        ref: 'agent_agent_sent_packages'
    },
    CheckoutRequestID: {

        type: String

    },
    phone_number: {
        type: String
    },
    ResponseCode: {
        type: Number
    },
    MpesaReceiptNumber: {
        type: String
    },
    amount: {
        type: Number
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    ResultDesc: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model('mpesalog', MpesaLogsSchema)
