var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const RiderRoutesSchema = new Schema({
    agent: {
        type: Schema.Types.ObjectId,
        ref: 'agents_details'
    },
    rider: {
        type: Schema.Types.ObjectId,
        ref: 'rider'
    },
    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('rider_routes', RiderRoutesSchema);