var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const agentadminSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    business_name: {
        type: String,
    },
    images: {
        type: Array
    },
    working_hours: {
        type: String,
    },
    mpesa_number: {
        type: String,
    },
    loc: {
        lat: {
            type: String,
        },
        lng: {
            type: String,
        },
        name: {
            type: String,
        }
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('agents_details ', agentadminSchema);