var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    file: {
        type: String,

    },

    deleted_at: {
        type: Date,
        default: null
    },

    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    location: {
        type: Schema.Types.ObjectId,
        ref: 'thrifter_location'
    },

}, { timestamps: true });



const User = mongoose.model('thrifter', UserSchema);
module.exports = User