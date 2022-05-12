var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const UserSchema = new Schema({
   
    deleted_at: {
        type: Date,
        default: null
    },
    reject_reason: {
        type: String,
    },  

    return_reason: {
        type: String,
    },  

}, { timestamps: true });

const User = mongoose.model('reason', UserSchema);
module.exports = User