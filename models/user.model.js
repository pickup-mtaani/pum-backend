var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;
const UserSchema = new Schema({
    l_name: {
        type: String,

    },
    f_name: {
        type: String,

    },
    name: {
        type: String,
    },

    phone_number: {
        type: String

    },
    verification_code: {
        type: Number,
        default: null

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

    },
    isSubAgent: {
        type: Boolean,
        default: false
    },
    agent_id: {
        type: String,
    },
    id_number: {
        type: String,

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


    rider: {
        type: Schema.Types.ObjectId,
        ref: 'rider'
    },
    // agent: {
    //     type: Schema.Types.ObjectId,
    //     ref: ''
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
