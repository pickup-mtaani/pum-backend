var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;
const RiderSchema = new Schema({


    id_number: {
        type: String,
        // required: true
    },
    rider_id_back: {
        type: String,
        // required: true
    },
    // required: true

    rider_avatar: {
        type: String,
        // required: true
    },

    rider_id_front: {
        type: String,
        // required: true
    },

    bike_reg_plate: {
        type: String,
        // required: true
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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });

RiderSchema.methods.comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};

module.exports = mongoose.model('rider', RiderSchema);
