var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const BizDetailsSchema = new Schema({
    recieve_payment_till_No: {
        type: Number,

    },
    payment_mpesa_No: {
        type: Number,
        required: true
    },
    recieve_payment_mpesa_No: {
        type: Number,

    },
    recieve_payment_paybill_no: {
        no: {
            type: Number,

        },
        account: {
            type: Number,

        }
    },
    loc: {
        type: { type: String },
        coordinates: []
    },
    location: {
        type: Schema.Types.ObjectId,
        ref: 'business'
    },
    business: {
        type: Schema.Types.ObjectId,
        ref: 'business'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    agent: {
        type: Schema.Types.ObjectId,
        ref: 'agents_details '
    },
    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



const Biz = mongoose.model('business_details', BizDetailsSchema);
module.exports = Biz