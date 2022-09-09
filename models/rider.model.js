var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;
const RiderSchema = new Schema({

    rider_name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        // required: true
    },
    role: {
        type: String,
        default: "rider"
    },
    id_number: {
        type: String,
        // required: true
    },
    rider_id_back: {
        type: String,
        // required: true
    },
    verification_code: {
        type: Number,
        // required: true
    },
    rider_avatar: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true
    },
    rider_id_front: {
        type: String,
        // required: true
    },
    hashPassword: {
        type: String,
        required: true
    },
    bike_reg_plate: {
        type: String,
        // required: true
    },
    activated: {
        type: Boolean,
        default: false
    },
    rider_licence_photo: {
        type: String,
        // required: true
    },
    delivery_rate: {
        type: Number,
        // required: true
    },
    charger_per_km: {
        type: Number,
        // required: true
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
