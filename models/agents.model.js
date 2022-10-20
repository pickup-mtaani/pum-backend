var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const AgentSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    zone: {
        type: Schema.Types.ObjectId,
        ref: 'zone'
    },
    id: {
        type: String,

    },
    lng: {
        type: Number,

    },
    lat: {
        type: Number,

    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



const Agent = mongoose.model('agent-location', AgentSchema);
module.exports = Agent