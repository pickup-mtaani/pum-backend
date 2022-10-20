var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const AdminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String

    },


    deleted_at: {
        type: Date,
        default: null
    },
    activated: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    gender: {
        type: String,
        default: 'Not Specified'
    },

    hashPassword: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

}, { timestamps: true });

AdminSchema.methods.comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};

const User = mongoose.model('admin', AdminSchema);
module.exports = User
