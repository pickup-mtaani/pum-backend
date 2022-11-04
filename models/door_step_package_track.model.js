var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');


const Schema = mongoose.Schema;

// "request", "delivered", "collected", "cancelled", "rejected", "on-transit", "dropped-to-agent", 'collected', "assigned", "recieved-warehouse", "picked", "picked-from-sender", "unavailable", "dropped", "assigned-warehouse", "warehouse-transit"
const NarationsSchema = new Schema({
    state: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: moment()
    },

    droppedTo: {
        type: Schema.Types.ObjectId,
        ref: 'agents_details'
    },
    droppedAt: {
        type: Date,
        default: null
    },

    warehouseAt: {
        type: Date,
        default: null
    },
    recievedTo: {
        type: Schema.Types.ObjectId,
        ref: 'agents_details'
    },
    recievedAt: {
        type: Date,
        default: null
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'rider'
    },
    assignedAt: {
        type: Date,
        default: null
    },
    reassignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'rider'
    },
    droppedToagentAt: {
        type: Date,
        default: null
    },
    droppedToagent: {
        type: Schema.Types.ObjectId,
        ref: 'agents_details'
    },
    reassignedAt: {
        type: Date,
        default: null
    },
    reciept: {
        type: String,
    },

    collectedby: {
        type: Schema.Types.ObjectId,
        ref: 'collector'
    },
    collectedAt: {
        type: Date,
        default: null
    },
    package: {
        type: Schema.Types.ObjectId,
        ref: 'doorStep_delivery_packages'
    },
    descriptions: {
        type: String,
        required: true
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('agent-package_track', NarationsSchema);
