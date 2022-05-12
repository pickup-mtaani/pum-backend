var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const RiderSchema = new Schema({

    rider_name: {
        type: String,
        required: true
    },
    rider_phone_number: {
        type: String,
        // required: true
    },
    rider_ID_number: {
        type: String,
        // required: true
    },
    delivery_rate: {
        type: Number,
        required: true
    },
    charger_per_km: {
        type: Number,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('rider', RiderSchema);
