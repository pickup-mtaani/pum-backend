var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const UserSchema = new Schema({
    l_name: {
        type: String,
        required: true
    },
    f_name: {
        type: String,
        // required: true
    },
    phone_number: {
        type: String
        // required: true
    },
    verification_code: {
        type: Number,
        default: null
        // required: true
    },
    deleted_at: {
        type: Date,
        default: null
    },
    activated: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: String,
        // required: true
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
        type: String,
        default: "seller"
    },
    // role: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'role'
    // },


    hashPassword: {
        type: String,
        required: true
    },
    username: {
        type: String,

    },
    email: {
        type: String,
        required: true
    },

}, { timestamps: true });

UserSchema.methods.comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};

const User = mongoose.model('user', UserSchema);
module.exports = User
