var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const collectorSchema = new Schema({

    collector_name: {
        type: String,
        required: true
    },

    collector_phone_number: {
        type: String,
        required: true
    },
    collector_national_id: {
        type: String,
        required: true
    },
    collector_signature: {
        type: String,
        // required: true
    },
    time: {
        type: String,
        // required: true
    },
    type: {
        type: String,
        // required: true
    },

    package1: {
        type: Schema.Types.ObjectId,
        ref: 'agent_agent_packages'
    },
    package2: {
        type: Schema.Types.ObjectId,
        ref: 'rent_a_shelf_packages'
    },
    package3: {
        type: Schema.Types.ObjectId,
        ref: 'doorStep_delivery_packages'
    },

    dispatchedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('collector', collectorSchema);
