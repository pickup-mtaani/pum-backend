var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const ParcelSchema = new Schema({
    recipient_name: {
        type: String,
        required: true
    },
    recipient_phone: {
        type: String,
        required: true
    },
   
    thrifter_id: {
        type: Schema.Types.ObjectId,
        ref: 'thrifter'
    },
    receiving_agent: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    rejecting_agent: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    package_value: {
        type: String,
        // required: true
    },
   
    receipt_no: {
        type: String,
        // required: true
    },

    pack_color: {
        type: String,
        // required: true
    },
   
    package_position: {
        type: String,
        default: 'Not Specified'
    },
    current_custodian: {
        type: Schema.Types.ObjectId,
        ref: 'thrifter_location'
    },
    rejected_reasons: {
        type: Schema.Types.ObjectId,
        ref: 'reason'
    },
    recieved: {
        type: Boolean,
        default: false
    },
    collected: {
        type: Boolean,
        default: false
    },
    collected_at: {
        type: Date,
        default: null
    },
    rejected: {
        type: Boolean,
        default: false
    },
    recieved_at: {
        type: Date,
        default: null
    },
    rejected_at: {
        type: Date,
        default: null
    },
    returned: {
        type: Boolean,
        default: false
    },
    deleted_at: {
        type: Date,
        default: null
    },
   

}, { timestamps: true });



const User = mongoose.model('package', ParcelSchema);
module.exports = User