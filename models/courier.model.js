var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const courierSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    descriptions: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    checked: {
        type: Boolean,
        default: false
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



const courier = mongoose.model('courier', courierSchema);
module.exports = courier