var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;

const RoutesSchema = new Schema({

    rider: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    lng: {
        type: String,
    },
    lat: {
        type: String,

    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('rider_path', RoutesSchema);
