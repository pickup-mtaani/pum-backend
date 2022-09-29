var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;
const RiderSchema = new Schema({


    id_number: {
        type: String,

    },
    rider_id_back: {
        type: String,

    },


    rider_avatar: {
        type: String,

    },
    chat_mates:
        [
            {
                type: Schema.Types.ObjectId,
                ref: "user",
            }
        ],
    rider_id_front: {
        type: String,

    },

    bike_reg_plate: {
        type: String,

    },

    rider_licence_photo: {
        type: String,

    },
    delivery_rate: {
        type: Number,

    },
    charger_per_km: {
        type: Number,

    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    assignedpackages: {
        type: Number,
    },
    assignedpackages: {
        type: Number,
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
