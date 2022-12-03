var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const NotificationSchema = new Schema({
    dispachedTo: {
        type: String,
        required: true
    },
    receipt_no: {
        type: String,
        required: true
    },
    descriptions: {
        type: String,
        required: true
    },
    p_type: {
        type: String,
        required: true
    },
    s_type: {
        type: String,
        required: true
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('notification', NotificationSchema);
