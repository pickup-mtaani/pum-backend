var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const DeclinedSchema = new Schema({
    package: {
        type: Schema.Types.ObjectId,
        ref: 'agent_agent_sent_packages'
    },
    reason: {
        type: String,
        required: true
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



const Role = mongoose.model('declined_door_step_packages', DeclinedSchema);
module.exports = Role