var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const customerSchema = new Schema({

    customer_name: {
        type: String,
        required: true
    },

    customer_phone_number: {
        type: String,
        required: true
    },
    total_package_count: {
        type: Number,
        default: 0
    },
    door_step_package_count: {
        type: Number,
        default: 0
    },
    erands_package_count: {
        type: Number,
        default: 0
    },
    agent_package_count: {
        type: Number,
        default: 0
    },
    rent_shelf_package_count: {
        type: Number,
        default: 0
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('customer', customerSchema);
