var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const RiderRoutesSchema = new Schema({
    agent: {
        type: Schema.Types.ObjectId,
        ref: 'agents_details'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('agent_user', RiderRoutesSchema);