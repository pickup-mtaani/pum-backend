var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Types } = require('mysql');


const Schema = mongoose.Schema;


const UserSchema = new Schema({
    l_name: {
        type: String,
        // required: true
    },
    f_name: {
        type: String,
        // required: true
    },
    phone_number: {
        type: Number,
        // required: true
    },
    verification_code: {
        type: Number,
        // required: true
    },
    deleted_at: {
        type: Date,
        default: null
    },

    id_number: {
        type: String,
        // required: true
    },
    gender: {
        type: String,
        default: 'Not Specified'
    },
    DOB: {
        type: Date,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'role'
    },

    hashPassword: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },

}, { timestamps: true });

UserSchema.methods.comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};

const User = mongoose.model('user', UserSchema);
module.exports = User