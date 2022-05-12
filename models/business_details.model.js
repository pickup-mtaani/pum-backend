var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const BizDetailsSchema = new Schema({
    till_No: {
        type: Number,
        required: true
    },
    Mpesa_No: {
        type: Number,
        required: true
    },
    loc: {
        type: { type: String },
        coordinates: []
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
        ref: 'agent'
    },
    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



const Biz = mongoose.model('business_details', BizDetailsSchema);
module.exports = Biz