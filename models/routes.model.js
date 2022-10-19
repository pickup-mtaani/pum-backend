var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;

const RoutesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rider: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    zone: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },


    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('route', RoutesSchema);
